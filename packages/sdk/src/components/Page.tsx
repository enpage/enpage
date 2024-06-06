import { useEffect } from "react";
import { BlockProps, PageProps } from "../types";
import { BaseBlock } from "./BaseBlock";
import { useRunContext } from "../hooks/use-run-context";
import clsx from "clsx";

export function Page(
  props: Omit<BlockProps<"div", PageProps>, "blockType" | "id">,
) {
  const context = useRunContext();

  // on load, if we are in edit mode, disable all interactions that do not belong to the editor
  // by settings pointer-events to none
  useEffect(() => {
    if (context.mode === "edit") {
      document
        .querySelectorAll(
          "a:not([data-editor-ui]), button:not([data-editor-ui])",
        )
        .forEach((el) => {
          (el as HTMLElement).style.setProperty(
            "pointer-events",
            "none",
            "important",
          );
        });
    }
  }, []);
  return (
    <BaseBlock
      {...props}
      id="enpage-page"
      blockType="page"
      label="Page"
      editable
      className={clsx(props.className, {
        "group/editor": context.mode === "edit",
      })}
    />
  );
}
