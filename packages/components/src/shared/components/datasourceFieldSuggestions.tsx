import { ReactRenderer } from "@tiptap/react";
import type { MentionNodeAttrs, MentionOptions } from "@tiptap/extension-mention";
import tippy, { type GetReferenceClientRect } from "tippy.js";

// @ts-ignore
import MentionList from "./DatasourceFieldList.jsx";
import type { SuggestionOptions } from "@tiptap/suggestion";

const config: Omit<SuggestionOptions<any, MentionNodeAttrs>, "editor"> = {
  // items: ({ query }: { query: string }) => {
  //   return [
  //     "Lea Thompson",
  //     "Cyndi Lauper",
  //     "Tom Cruise",
  //     "Madonna",
  //     "Jerry Hall",
  //     "Joan Collins",
  //     "Winona Ryder",
  //     "Christina Applegate",
  //     "Alyssa Milano",
  //     "Molly Ringwald",
  //     "Ally Sheedy",
  //     "Debbie Harry",
  //     "Olivia Newton-John",
  //     "Elton John",
  //     "Michael J. Fox",
  //     "Axl Rose",
  //     "Emilio Estevez",
  //     "Ralph Macchio",
  //     "Rob Lowe",
  //     "Jennifer Grey",
  //     "Mickey Rourke",
  //     "John Cusack",
  //     "Matthew Broderick",
  //     "Justine Bateman",
  //     "Lisa Bonet",
  //   ]
  //     .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
  //     .slice(0, 5);
  // },

  char: "{{",

  render: () => {
    let component: ReactRenderer<MentionList>;
    let popup: ReturnType<typeof tippy>;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default config;
