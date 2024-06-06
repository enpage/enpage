import { BlockProps, SectionsProps } from "../types";
import { BaseBlock } from "./BaseBlock";
import { useRunContext } from "../hooks/use-run-context";
// import { BsPlusCircle } from "react-icons/bs";

export function Sections(props: Omit<BlockProps<"div", SectionsProps>, "blockType" | "id">) {
  const context = useRunContext();
  return (
    <BaseBlock {...props} blockType="sections" label="Sections" id="enpage-sections">
      {props.children}
      {context.mode === "edit" && (
        <button
          data-editor-ui
          className="text-enpage-600 group mx-auto flex w-max flex-col items-center gap-1 place-self-center font-medium transition-transform
            duration-200 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            console.log("foo");
          }}
        >
          {/* <BsPlusCircle className=" border-0 text-5xl" /> */}
          <span className="text-sm opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
            Add section
          </span>
        </button>
      )}
    </BaseBlock>
  );
}
