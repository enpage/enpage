// worker-css-processor.ts
import postcss, {
  type Plugin,
  type Root,
  type Rule,
  type AtRule,
  type Declaration,
  type Result,
  type ChildNode,
  type Container,
  Document,
  type AnyNode,
} from "postcss";
import autoprefixer from "autoprefixer";

interface StyleOverrides {
  [selector: string]: {
    [property: string]: string;
  };
}

interface Change {
  type: string;
  selector: string;
  property?: string;
  value?: string;
  parent?: string; // For nested rules, this would be the parent at-rule
}

interface ProcessingResult {
  css: string;
  warnings: string[];
  changes: { [selector: string]: string };
}

export class WorkerCSSProcessor {
  private cache: Map<string, Rule | AtRule>;
  private ast: Root | null;
  private postcssInstance: postcss.Processor;
  private lastResult: Result | null;

  constructor() {
    this.cache = new Map();
    this.ast = null;
    this.lastResult = null;
    this.postcssInstance = postcss([autoprefixer, this.createStyleOverridePlugin({})]);
  }

  public async initialize(css: string, overrides: StyleOverrides): Promise<void> {
    this.ast = postcss.parse(css);
    await this.processAST(overrides);
    this.cacheASTNodes();
  }

  public async processChange(change: Change, overrides: StyleOverrides): Promise<ProcessingResult> {
    const affectedNodes = this.findAffectedNodes(change);
    for (const node of affectedNodes) {
      await this.reprocessNode(node, overrides);
    }
    return this.generateCSS();
  }

  public generateCSS(): ProcessingResult {
    if (!this.ast) {
      throw new Error("AST is not initialized");
    }
    return {
      css: this.ast.toString(),
      warnings: this.getWarnings(),
      changes: this.getChanges(),
    };
  }

  private createStyleOverridePlugin(overrides: StyleOverrides): Plugin {
    return {
      postcssPlugin: "style-override",
      Once(root: Root) {
        root.walk((node) => {
          if (node.type === "rule") {
            const rule = node as Rule;
            if (overrides[rule.selector]) {
              rule.walkDecls((decl) => {
                if (overrides[rule.selector][decl.prop]) {
                  decl.value = overrides[rule.selector][decl.prop];
                }
              });
            }
          }
        });

        for (const selector in overrides) {
          if (!root.some((node) => node.type === "rule" && (node as Rule).selector === selector)) {
            const rule = postcss.rule({ selector });
            for (const prop in overrides[selector]) {
              rule.append({ prop, value: overrides[selector][prop] });
            }
            root.append(rule);
          }
        }
      },
    };
  }

  private async processAST(overrides: StyleOverrides): Promise<void> {
    this.postcssInstance = postcss([autoprefixer, this.createStyleOverridePlugin(overrides)]);
    this.lastResult = await this.postcssInstance.process(this.ast!, { from: undefined });
  }

  private cacheASTNodes(): void {
    this.ast?.walk((node) => {
      if (node.type === "rule" || node.type === "atrule") {
        this.cache.set(this.getNodeKey(node), node as Rule | AtRule);
      }
    });
  }

  private getNodeKey(node: AnyNode): string {
    if (node.type === "atrule") {
      return `@${(node as AtRule).name} ${(node as AtRule).params}`;
    }
    if (node.type === "rule") {
      const rule = node as Rule;
      const parentKey = this.getParentKey(rule.parent);
      return parentKey + rule.selector;
    }
    return node.toString();
  }

  private getParentKey(parent: Container<ChildNode> | undefined): string {
    if (!parent || parent.type === "root" || parent.type === "document") {
      return "";
    }
    // biome-ignore lint/style/useTemplate: let the space here as it is more visually clear
    return this.getNodeKey(parent as AnyNode) + " ";
  }

  private findAffectedNodes(change: Change): (Rule | AtRule)[] {
    const affectedNodes: (Rule | AtRule)[] = [];
    this.ast?.walk((node) => {
      if (node.type === "rule") {
        const rule = node as Rule;
        if (rule.selector === change.selector) {
          const nodeKey = this.getNodeKey(rule);
          if (!change.parent || nodeKey === change.parent) {
            affectedNodes.push(rule);
          }
        }
      } else if (node.type === "decl") {
        const decl = node as Declaration;
        if (decl.prop === change.property) {
          const parent = decl.parent;
          if (parent && parent.type === "rule") {
            const parentRule = parent as Rule;
            if (parentRule.selector === change.selector) {
              const nodeKey = this.getNodeKey(parentRule);
              if (!change.parent || nodeKey === change.parent) {
                affectedNodes.push(parentRule);
              }
            }
          }
        }
      }
    });
    return affectedNodes;
  }

  private async reprocessNode(node: Rule | AtRule, overrides: StyleOverrides): Promise<void> {
    const nodeString = node.toString();
    const processedNode = postcss.parse(nodeString);
    const result = await this.postcssInstance.process(processedNode, { from: undefined });
    this.updateASTNode(node, processedNode.nodes[0] as Rule | AtRule);
    this.cache.set(this.getNodeKey(node), node);
    this.lastResult = result;
  }

  private updateASTNode(oldNode: Rule | AtRule, newNode: Rule | AtRule): void {
    oldNode.removeAll();
    newNode.nodes?.forEach((child) => oldNode.append(child.clone()));
  }

  private getWarnings(): string[] {
    return this.lastResult ? this.lastResult.warnings().map((warning) => warning.toString()) : [];
  }

  private getChanges(): { [selector: string]: string } {
    const changes: { [selector: string]: string } = {};
    this.ast?.walk((node) => {
      if (node.type === "rule") {
        const rule = node as Rule;
        const key = this.getNodeKey(rule);
        changes[key] = rule.nodes
          .filter((node) => node.type === "decl")
          .map((decl) => `${(decl as Declaration).prop}: ${(decl as Declaration).value}`)
          .join(";");
      }
    });
    return changes;
  }
}
