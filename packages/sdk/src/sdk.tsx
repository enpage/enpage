import {
  // default as React,
  ElementType,
  FunctionComponent,
  useContext,
  useRef,
} from "react";
import {
  BlockProps,
  ContainerProps,
  ElementProps,
  PageProps,
  PropTypes,
  SectionProps,
  SectionsProps,
  TextProps,
} from "./types";
import { useBlockId } from "./hooks/use-block-id";
import { nativeStyle, Styles } from "@enpage/style-system";
// import { nativeStyle, Styles } from "./styles.css";
import { clsx, isEditMode } from "./helpers";
import { RunContext } from "./hooks/use-run-context";

/**
 * Default block tag
 */
const defaultBlockTag = "div";

/**
 * Base block component
 */
function BaseBlock(props: BlockProps<ElementType, PropTypes, Styles>) {
  const id = useBlockId(props.id);
  const groupId = useBlockId(props.groupId);
  const ElementTag = props.as || defaultBlockTag;
  const context = useContext(RunContext);
  const ref = useRef<HTMLElement>();

  // Extract props so we can pass the rest to the element
  const {
    as,
    blockType,
    customizations,
    duplicatable,
    hoverAnimation,
    hoverAnimationDuration,
    textEditable,
    label,
    visibleAnimation,
    visibleAnimationDuration,
    preventReordering,
    ...rest
  } = props;

  const {
    className: initialClassName,
    style: initialStyle,
    dynamicStyles,
    ...other
  } = rest;

  const { className, style, otherProps } = nativeStyle(other);
  const editing = isEditMode(context);

  return (
    <ElementTag
      ref={ref}
      className={clsx(initialClassName, className)}
      style={{ ...initialStyle, ...style }}
      {...otherProps}
      id={id}
      data-block-type={blockType}
      data-enable-text-editing={editing ? textEditable : undefined}
      data-label={editing ? label : undefined}
      data-duplicatable={editing ? duplicatable : undefined}
      data-customizations={editing ? customizations : undefined}
      data-hover-animation={editing ? hoverAnimation : undefined}
      data-hover-animation-duration={
        editing ? hoverAnimationDuration : undefined
      }
      data-group={editing && blockType === "container" ? groupId : undefined}
      onClick={(e: Event) => {
        e.stopPropagation();
        context.onSelectBlock?.(id);
      }}
    >
      {props.children}
    </ElementTag>
  );
}

const baseObject = {
  // Block: BaseBlock,
  /**
   * By default, the container is reorderable
   */
  Container: (
    props: Omit<BlockProps<"div", ContainerProps, Styles>, "blockType">,
  ) => (
    <BaseBlock
      {...props}
      preventReordering={props.preventReordering ?? false}
      blockType="container"
    />
  ),
  Page: (props: Omit<BlockProps<"div", PageProps, Styles>, "blockType">) => (
    <BaseBlock {...props} id="enpage-page" blockType="page" />
  ),
  Sections: (
    props: Omit<BlockProps<"div", SectionsProps, Styles>, "blockType">,
  ) => <BaseBlock {...props} blockType="sections" />,
  Section: (
    props: Omit<BlockProps<"div", SectionProps, Styles>, "blockType">,
  ) => <BaseBlock {...props} blockType="section" />,
  Element: (
    props: Omit<BlockProps<"div", ElementProps, Styles>, "blockType">,
  ) => <BaseBlock {...props} blockType="element" />,
  Text: (props: Omit<BlockProps<"span", TextProps, Styles>, "blockType">) => (
    <BaseBlock
      textEditable
      {...props}
      as={props.as ?? "span"}
      blockType="text"
    />
  ),
};

const proxyHandler = {
  get(target: typeof baseObject, prop: string, receiver: typeof baseObject) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    return (
      props: Omit<BlockProps<ElementType, PropTypes, Styles>, "blockType">,
    ) => <BaseBlock {...props} as={prop as ElementType} blockType="element" />;
  },
};

type EnpageObject = typeof baseObject & {
  [T in keyof JSX.IntrinsicElements]: FunctionComponent<
    BlockProps<T, PropTypes, Styles>
  >;
};

export const Enpage = new Proxy(baseObject, proxyHandler) as EnpageObject;
