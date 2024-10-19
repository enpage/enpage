import { LuPlus, LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsTablet } from "react-icons/bs";
import { clsx } from "../utils/component-utils";
import {
  Fragment,
  type MouseEvent,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDraft, useDraftUndoManager, useEditor } from "@enpage/sdk/browser/use-editor";
import { IoSettingsOutline } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { LiaCopy } from "react-icons/lia";
import { Menu, MenuButton, MenuItem, MenuItems, type MenuItemsProps } from "@headlessui/react";
import { useIsLargeDevice, useIsMobileDevice } from "../hooks/use-is-device-type";
import { LuPanelTop, LuPanelBottom } from "react-icons/lu";
import { TiArrowUp } from "react-icons/ti";
import { VscLayoutPanelOff } from "react-icons/vsc";

export default function Toolbar() {
  const editor = useEditor();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const isSmallDevice = useIsMobileDevice();
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const isDesktop = useIsLargeDevice();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);

  const switchPosition = (e: MouseEvent) => {
    e.stopPropagation();
    setPosition((prev) => (prev === "top" ? "bottom" : "top"));
  };

  const switchPreviewMode = useCallback(() => {
    switch (editor.previewMode) {
      case "desktop":
        editor.setPreviewMode("tablet");
        break;
      case "tablet":
        editor.setPreviewMode("mobile");
        break;
      case "mobile":
        if (isDesktop) {
          editor.setPreviewMode("desktop");
        } else {
          editor.setPreviewMode("tablet");
        }
        break;
    }
  }, [editor.previewMode, editor.setPreviewMode, isDesktop]);

  // bg-primary-600
  const standardBtn = `bg-gradient-to-t from-primary-600 to-primary-600/80
                        disabled:hover:from-primary-600 disabled:hover:to-primary-600/80
                       hover:from-primary-700 hover:to-primary-700/80
                       active:from-primary-800 active:to-primary-700/90
   disabled:text-white/40
    disabled:hover:border-l-primary-500
    hover:border-l-primary-700
    border-x border-l-primary-500 border-r-primary-700 `;

  const rocketBtn = `bg-gradient-to-tr from-orange-500 to-yellow-400
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default";

  const btnClass = `flex flex-auto items-center justify-center py-1.5 px-4 gap-x-0.5
    xl:first:rounded-l-lg xl:last:rounded-r-lg hover:bg-gradient-to-t group relative`;

  const tooltipCls = `absolute -bottom-7 py-0.5 px-2.5 bg-primary-600/60 left-auto right-auto
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  // const tooltipCls = clsx(
  //   styles["toolbar-tooltip"],
  //   "group-hover:block group-hover:opacity-100 group-hover:translate-y-0",
  // );

  return (
    <section
      role="toolbar"
      className={clsx("z-[9999] lg:py-8 lg:fixed lg:left-1/2 lg:-translate-x-1/4", {
        "lg:top-2": position === "top",
        "lg:bottom-2": position === "bottom",
      })}
    >
      <nav
        className="xl:mx-auto min-w-fit max-sm:w-full xl:max-w-fit bg-primary-500
                  flex h-[3.6rem] justify-start shadow-2xl
                  text-xl text-white xl:rounded-lg"
      >
        {isSmallDevice === false && (
          <button type="button" className={clsx(btnClass, standardBtn, "px-1 order-first")}>
            <img src={logo} alt="Enpage" className="h-8 w-auto" />
            <span className={tooltipCls}>Back to dashboard</span>
          </button>
        )}
        <button
          type="button"
          disabled={false}
          onClick={editor.toggleLibraryVisible}
          className={clsx(btnClass, standardBtn, "order-1 max-md:order-10 ")}
        >
          <LuPlus className="h-7 w-auto" />
          <span className={tooltipCls}>Add elements</span>
        </button>

        <ToolbarMenu
          anchor="bottom"
          items={[
            { label: "Create new page" },
            { label: "View all pages" },
            { type: "separator" },
            { label: "Schedule publish", shortcut: "⌘⇧D" },
          ]}
        >
          <button
            type="button"
            className={clsx(btnClass, standardBtn, btnWithArrow, "order-2 max-sm:order-3")}
          >
            <LiaCopy className="h-7 w-auto" />
            {/* <LuMenu className="h-7 w-auto" /> */}
            <RiArrowDownSLine className="h-4 w-4 opacity-60  -mr-1" />
            <span className={tooltipCls}>Pages</span>
          </button>
        </ToolbarMenu>
        <button
          disabled={!canUndo}
          onClick={() => undo()}
          type="button"
          className={clsx(btnClass, standardBtn, "order-3 max-md:order-1")}
        >
          <LuUndo className="h-7 w-auto" />
          <span className={tooltipCls}>Undo</span>
        </button>
        <button
          disabled={!canRedo}
          onClick={() => redo()}
          type="button"
          className={clsx(btnClass, standardBtn, "order-4 max-md:order-2")}
        >
          <LuRedo className="h-7 w-auto" />
          <span className={tooltipCls}>Redo</span>
        </button>
        {isSmallDevice === false && (
          <>
            <button
              type="button"
              className={clsx(btnClass, standardBtn, "order-5")}
              onClick={switchPreviewMode}
            >
              {editor.previewMode === "desktop" && <RxDesktop className="h-7 w-auto" />}
              {editor.previewMode === "mobile" && <RxMobile className="h-7 w-auto" />}
              {editor.previewMode === "tablet" && <BsTablet className="h-7 w-auto" />}
              <span className={tooltipCls}>Switch View</span>
            </button>
          </>
        )}

        <ToolbarMenu
          anchor="bottom"
          items={[
            { label: "Page Settings" },
            { type: "separator" },
            {
              label: position === "top" ? "Move toolbar to bottom" : "Move toolbar to top",
              onClick: switchPosition,
            },
          ]}
        >
          <button
            type="button"
            className={clsx(btnClass, standardBtn, btnWithArrow, "order-2 max-sm:order-3")}
          >
            <IoSettingsOutline className="h-7 w-auto" />
            {/* <LuMenu className="h-7 w-auto" /> */}
            <RiArrowDownSLine className="h-4 w-4 opacity-60  -mr-1" />
            <span className={tooltipCls}>Site settings</span>
          </button>
        </ToolbarMenu>

        <ToolbarMenu
          anchor="bottom end"
          items={[{ label: "Publish on web" }, { label: "Schedule publish", shortcut: "⌘⇧D" }]}
        >
          <button type="button" className={clsx(btnClass, rocketBtn, btnWithArrow, "order-last")}>
            <RxRocket className="h-7 w-auto" />
            <RiArrowDownSLine className="h-4 w-4 opacity-60 -mr-1" />
            <span className={tooltipCls}>Deploy</span>
          </button>
        </ToolbarMenu>
      </nav>
    </section>
  );
}

type ToolbarMenuItem = {
  label: string;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type?: never;
};

type ToolbarMenuSeparator = {
  type: "separator";
};

type ToolbarMenuItems = (ToolbarMenuItem | ToolbarMenuSeparator)[];

function ToolbarMenu(
  props: PropsWithChildren<{ items: ToolbarMenuItems; anchor: MenuItemsProps["anchor"] }>,
) {
  return (
    <Menu>
      <MenuButton as={Fragment}>{props.children}</MenuButton>
      <MenuItems
        anchor={props.anchor}
        transition
        className="rounded-md bg-white/85 dark:bg-dark-700 backdrop-blur p-2.5 min-w-44 mt-1 shadow-xl
                  shadow-black/10 origin-top flex flex-col gap-y-px transition duration-[50ms]
                    ease-out data-[closed]:scale-95 data-[closed]:opacity-0 select-none z-[9999]"
      >
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-2 h-px bg-black/10" />
          ) : (
            <MenuItem key={index}>
              <button
                onClick={item.onClick}
                type="button"
                className="group flex items-center text-nowrap rounded-[inherit] gap-5
                py-1.5 px-2.5
                max-sm:py-2.5 max-sm:text-lg
                w-full dark:text-white/90
                    text-left data-[focus]:bg-primary-600 data-[focus]:text-white "
              >
                {item.label}
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50 dark:text-dark-300
                      group-data-[focus]:text-white/70 group-data-[active]:text-white/70"
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            </MenuItem>
          ),
        )}
      </MenuItems>
    </Menu>
  );
}
