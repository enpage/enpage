import {
  // default as React,
  ElementType,
  useContext,
  useRef,
} from "react";
import { BlockProps, PropTypes } from "../types";
import { useBlockId } from "../hooks/use-block-id";
import { clsx, isEditMode } from "../helpers";
import { useRunContext } from "../hooks/use-run-context";
import { useCssRegistry } from "../hooks/use-css-registry";

/**
 * Default block tag
 */
const defaultBlockTag = "div";
/**
 * Base block component
 */
export function BaseBlock(props: BlockProps<ElementType, PropTypes>) {
  const id = useBlockId(props.id);
  const groupId = useBlockId(props.groupId);
  const ElementTag = props.as || defaultBlockTag;
  const context = useRunContext();
  const ref = useRef<HTMLElement>();
  const cssReg = useCssRegistry();
  const editing = isEditMode(context);

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
    editable,
    ...rest
  } = props;

  const { className, style, dynamicStyles, ...other } = rest;

  // const { className, style, otherProps } = nativeStyle(other);

  return (
    <ElementTag
      ref={ref}
      className={clsx(className)}
      style={style}
      {...other}
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
      data-editable={editing ? editable : undefined}
      data-group={editing && blockType === "container" ? groupId : undefined}
    >
      {props.children}
    </ElementTag>
  );
}
