import { onDragOver, onDragEnd, getInsertPosition } from "./dnd";
import editorCss from "@enpage/style-system/editor.css?url";
import { debounce } from "lodash-es";
import type {
  IframeFocusedPayload,
  IframeBlurredPayload,
  ElementSelectedPayload,
  DomUpdatedPayload,
  EditorMessage,
  EditorDragOverPayload,
  EditorDropPayload,
} from "./types";
import { getElementLabel, serializeDomData, unserializeDomData } from "./components/utils";
import type { BlockManifest } from "./components/base/ep-block-base";
import interact from "interactjs";

export async function initDevClient() {
  let resizing = false;

  // enable drag and drop on touch devices
  const currentURL = new URL(import.meta.url);
  const editorHost = `${currentURL.hostname}:3008`;
  const editorOrigin = `${currentURL.protocol}//${editorHost}`;

  // add a fixed pill at the bottom right of the page to go to switch to /editor.html
  // check if we are not in a iframe
  if (window.self === window.top) {
    const pill = document.createElement("div");
    pill.classList.add("ep-editor-link");
    pill.innerHTML = "View in editor";
    pill.onclick = () => {
      window.open(
        `http://${editorHost}/?templateUrl=${encodeURIComponent(window.location.href)}`,
        "enpage-editor",
      );
    };
    document.body.appendChild(pill);

    // For now, we only run the accessibility tests on the first page
    if (import.meta.env.DEV && window.location.search.includes("runtests")) {
      runAccessibilityTests();
    }

    //-----------------------------------
    // Editor context!
    //-----------------------------------
  } else {
    // add editor.css
    // const editorCssEl = document.createElement("link");
    // editorCssEl.rel = "stylesheet";
    // editorCssEl.href = editorCss;
    // document.head.appendChild(editorCssEl);

    // enable drag and drop on touch devices
    // window.addEventListener("focus", () => {
    //   window.parent.postMessage({ type: "iframe-focused" } satisfies IframeFocusedPayload, editorOrigin);
    // });

    // window.addEventListener("blur", () => {
    //   window.parent.postMessage({ type: "iframe-blurred" } satisfies IframeBlurredPayload, editorOrigin);
    // });

    function onElementSelected(element: HTMLElement) {
      const clone = {
        tagName: element.tagName.toLowerCase(),
        innerHTML: element.innerHTML,
        innerText: element.innerText,
        outerHTML: element.outerHTML,
        label: getElementLabel(element),
        computedStyles: window.getComputedStyle(element).cssText,
        attributes: Array.from(element.attributes).reduce(
          (acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          },
          {} as Record<string, string>,
        ),
        manifest: element.dataset.manifest
          ? unserializeDomData<BlockManifest>(element.dataset.manifest)
          : null,
      };
      window.parent.postMessage(
        {
          type: "element-selected",
          element: clone,
        } satisfies ElementSelectedPayload,
        editorOrigin,
      );
    }

    const onElementClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.localName === "a" || target.localName === "button") {
        e.preventDefault();
      }

      // e.stopPropagation();
      if (target.hasAttribute("ep-editable") === false) {
        return;
      }

      // e.stopPropagation();
      onElementSelected(target);
    };

    const onDomChange = () => {
      window.parent.postMessage(
        {
          type: "dom-updated",
          head: document.head.outerHTML,
          body: document.body.outerHTML,
        } satisfies DomUpdatedPayload,
        editorOrigin,
      );
      setTimeout(allowElementsResizing, 200);
    };

    function allowElementsResizing() {
      document.querySelectorAll<HTMLElement>(".resizable").forEach((el) => {
        if (el.dataset.hasResizeHandler) {
          return;
        }
        el.dataset.hasResizeHandler = "true";

        // set a fixed size for the element rect as its style
        const rect = el.getBoundingClientRect();

        if (!el.style.width) {
          el.style.width = `${rect.width}px`;
        }
        if (!el.style.height) {
          el.style.height = `auto`;
        }

        const handleBottom = document.createElement("div");
        handleBottom.classList.add("resize-handle", "handle-bottom");
        el.appendChild(handleBottom);

        const handleTop = document.createElement("div");
        handleTop.classList.add("resize-handle", "handle-top");
        el.appendChild(handleTop);

        const handleRight = document.createElement("div");
        handleRight.classList.add("resize-handle", "handle-right");
        el.appendChild(handleRight);

        interact(el).resizable({
          edges: { top: true, left: true, bottom: true, right: true },
          allowFrom: ".resize-handle",
          modifiers: [
            interact.modifiers.aspectRatio({
              modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
            }),
          ],
          listeners: {
            start: () => {
              resizing = true;
            },
            move: function (event) {
              resizing = true;
              Object.assign(event.target.style, {
                width: `${event.rect.width}px`,
                height: `${event.rect.height}px`,
                // transform: `translate(${x}px, ${y}px)`,
              });
            },
          },
        });
      });
    }

    document.body.addEventListener("click", onElementClick, { capture: true });

    // post message to the parent window when an element with the [ep-editable] attribute is clicked
    // document.querySelectorAll("[ep-editable]").forEach((el) => {
    //   el.addEventListener(
    //     "click",
    //     (e) => {
    //       if (e.target !== e.currentTarget) {
    //         return;
    //       }

    //       const element = e.target as HTMLElement;
    //       const elementClone = {
    //         tagName: element.tagName,
    //         innerHTML: element.innerHTML,
    //         innerText: element.innerText,
    //         outerHTML: element.outerHTML,
    //         label:
    //           element.getAttribute("ep-label") ??
    //           element.getAttribute("title") ??
    //           element.getAttribute("alt"),
    //         computedStyles: window.getComputedStyle(element).cssText,
    //         attributes: Array.from(element.attributes).reduce(
    //           (acc, attr) => {
    //             acc[attr.name] = attr.value;
    //             return acc;
    //           },
    //           {} as Record<string, string>,
    //         ),
    //       };
    //       window.parent.postMessage(
    //         { type: "element-selected", element: elementClone } satisfies ElementSelectedPayload,
    //         editorOrigin,
    //       );
    //     },
    //     {},
    //   );
    // });

    // we are in the editor iframe, we want to disable all interactions like links, buttons, etc
    // we still want to intercept clicks, but we want to prevent their default behavior
    // document.body.addEventListener(
    //   "click",
    //   (e) => {
    //     const element = e.target as HTMLElement;
    //     console.log("click event intercepted", element.localName);
    //     if (element.localName === "a" || element.localName === "button") {
    //       e.preventDefault();
    //       e.stopPropagation();
    //     }
    //   },
    //   { capture: true },
    // );

    // listen for drag events
    window.addEventListener("message", (e) => {
      const data = e.data as EditorMessage;
      // console.log(data);
      switch (data.type) {
        case "editor-dragend":
          document.body.style.cursor = "default";
          onDragEnd();
          break;
        case "editor-dragover": {
          onDragOver(data.block.type, data.coordinates);
          break;
        }
        case "editor-drop": {
          // handle drop
          console.log("create from editor-drop", data);
          const dragElement = createDragElement(data);
          const insertPosition = getInsertPosition(data.block.type, data.coordinates);
          if (insertPosition) {
            const { referenceElement, side } = insertPosition;
            console.log("insert position", insertPosition);
            if (side.horizontal === "left" || side.vertical === "top") {
              // @ts-ignore before is wrongly typed by cloudflare/worker-types
              referenceElement.before(dragElement);
            } else {
              // @ts-ignore after is wrongly typed by cloudflare/worker-types
              referenceElement.after(dragElement);
            }

            // trigger dom-updated event
            onDomChange();

            // trigger element selection after drop
            onElementSelected(dragElement);
          } else {
            console.warn("No insert position found for drag event", data);
          }
          break;
        }
      }
    });

    const restoreOverflow = debounce(() => {
      document.body.style.opacity = "1";
      resizing = false;
    }, 150);

    document.body.style.transition = "all 0.2s";

    const resizeObserver = new ResizeObserver((entries) => {
      if (resizing) {
        return;
      }
      console.log("resize observer", entries);
      document.body.style.opacity = "0";
      document.body.style.transition = "all 50ms";
      resizing = true;
      restoreOverflow();
    });

    resizeObserver.observe(document.body, { box: "content-box" });

    // allowElementsResizing();
  }
}

function createDragElement({ manifest, block }: EditorDragOverPayload | EditorDropPayload) {
  if (!block.template) {
    throw Error("No template provided in the drag event");
  }
  const temp = document.createElement("div");
  temp.innerHTML = block.template;
  const dragElement = temp.firstElementChild as HTMLElement;
  // dragElement.classList.add("resizable");
  dragElement.dataset.manifest = serializeDomData(manifest);
  return dragElement;
}

async function runAccessibilityTests() {
  const axe = (await import("axe-core")).default;
  const dontLocateTypes = ["page-has-heading-one"];

  axe.configure({
    branding: "Enpage",
  });

  axe
    .run({
      resultTypes: ["violations"],
    })
    .then((results) => {
      for (const violation of results.violations) {
        const foundIn = dontLocateTypes.includes(violation.id)
          ? ""
          : `Found in:\n\t${violation.nodes.map((node) => `- ${node.html}`).join("\n\n\t")}\n\n`;
        const message = `${violation.description}\n\n${foundIn}See: ${violation.helpUrl}`;
        if (violation.impact === "critical") {
          console.error(`[Accessibility error]: ${message}`);
        } else if (violation.impact === "serious" || violation.impact === "moderate") {
          console.warn(`[Accessibility warning]: ${message}`);
        }
      }
    })
    .catch((err) => {});
}
