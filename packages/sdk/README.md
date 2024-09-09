# CLI development

You can test the CLI without recompiling by running:

```shell
# Show help
pnpm exec tsx src/node/cli/program.ts

#  Publish example template
pnpm exec tsx src/node/cli/program.ts publish --dry-run ../template-example
```
