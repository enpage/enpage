import { LuPlus, LuUndo, LuRedo, LuPalette } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsTablet } from "react-icons/bs";
// import { clsx } from "../utils/component-utils";
import { VscLayoutSidebarLeft, VscLayoutSidebarRight, VscHome } from "react-icons/vsc";
import {
  type ComponentProps,
  Fragment,
  type FunctionComponent,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDraft, useDraftUndoManager, useEditor } from "@enpage/sdk/browser/use-editor";
import { tx } from "@enpage/sdk/browser/twind";
import { IoSettingsOutline } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { LiaCopy } from "react-icons/lia";
import { Menu, MenuButton, MenuItem, MenuItems, type MenuItemsProps } from "@headlessui/react";
import { useIsLargeDevice, useIsMobileDevice } from "../hooks/use-is-device-type";
import { TiArrowUp } from "react-icons/ti";
import { VscLayoutPanelOff } from "react-icons/vsc";
import { Tooltip, DropdownMenu } from "@enpage/sdk/browser/ui";
import { BiDotsVerticalRounded } from "react-icons/bi";

export type ToolbarProps = {
  position: "left" | "right";
  onPositionChange?: (position: "left" | "right") => void;
};

export default function Toolbar({ position, onPositionChange }: ToolbarProps) {
  const editor = useEditor();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const isDesktop = useIsLargeDevice();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);

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

  // bg-upstart-600
  const baseCls = `bg-gradient-to-r from-transparent to-[rgba(255,255,255,0.15)] border-y border-t-upstart-400 border-b-upstart-700`;
  const commonCls = `${baseCls}
    w-full
    disabled:hover:from-upstart-600 disabled:hover:to-upstart-600/80
    hover:from-upstart-700 hover:to-white/10
    active:from-upstart-800 active:to-transparent
    disabled:text-white/40 disabled:hover:border-t-upstart-400 disabled:hover:from-transparent disabled:hover:to-white/10
  `;

  const rocketBtn = `bg-gradient-to-tr from-orange-500 to-yellow-400 border-y border-t-orange-200 border-b-orange-600
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default";

  const btnClass = `flex items-center justify-center py-3 gap-x-0.5 aspect-square group relative disabled:hover:cursor-default`;

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/60 left-[calc(100%+.5rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-x-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-x-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60  -mr-3.5 -ml-1";

  return (
    <nav
      role="toolbar"
      className={tx(
        `bg-upstart-600 z-[9999]
          flex flex-col w-[3.7rem] text-xl text-white
          border-r border-upstart-500`,
        {
          "shadow-[5px_0px_25px_3px_rgba(0,0,0,0.2)]": !editor.panel,
        },
      )}
    >
      <button
        type="button"
        disabled={false}
        onClick={() => {
          window.location.href = "/dashboard";
        }}
        className={tx(btnClass, commonCls, "mt-auto")}
      >
        <VscHome className="h-8 w-auto" />
        <span className={tooltipCls}>Back to dashboard</span>
      </button>

      <div className={tx("flex-1", "border-t-upstart-400", baseCls)} />

      <button
        type="button"
        disabled={false}
        onClick={() => editor.togglePanel("library")}
        className={tx(btnClass, commonCls)}
      >
        <LuPlus className="h-7 w-auto" />
        <span className={tooltipCls}>Add elements</span>
      </button>

      {/* <ToolbarMenu
        items={[
          { label: "Create new page" },
          { label: "View all pages" },
          { type: "separator" },
          { label: "Schedule publish", shortcut: "⌘⇧D" },
        ]}
      >
        <button type="button" className={clsx(btnClass, commonCls, btnWithArrow)}>
          <LiaCopy className="h-7 w-auto" />
          <RiArrowDownSLine className={arrowClass} />
          <span className={tooltipCls}>Pages</span>
        </button>
      </ToolbarMenu> */}
      <button disabled={!canUndo} onClick={() => undo()} type="button" className={tx(btnClass, commonCls)}>
        <LuUndo className="h-7 w-auto" />
        <span className={tooltipCls}>Undo</span>
      </button>
      <button disabled={!canRedo} onClick={() => redo()} type="button" className={tx(btnClass, commonCls)}>
        <LuRedo className="h-7 w-auto" />
        <span className={tooltipCls}>Redo</span>
      </button>
      <button type="button" className={tx(btnClass, commonCls)} onClick={switchPreviewMode}>
        {editor.previewMode === "desktop" && <RxDesktop className="h-7 w-auto" />}
        {editor.previewMode === "mobile" && <RxMobile className="h-7 w-auto" />}
        {editor.previewMode === "tablet" && <BsTablet className="h-7 w-auto" />}
        <span className={tooltipCls}>Switch View</span>
      </button>

      <button type="button" className={tx(btnClass, commonCls)} onClick={() => editor.togglePanel("theme")}>
        <LuPalette className="h-7 w-auto" />
        <span className={tooltipCls}>Color theme</span>
      </button>

      <ToolbarMenu
        items={[
          { label: "Settings" },
          { type: "separator" },
          { label: "Create new page" },
          { label: "View all pages" },
        ]}
      >
        <button type="button" className={tx(btnClass, commonCls, btnWithArrow)}>
          <BiDotsVerticalRounded className="h-7 w-auto" />
          <span className={tooltipCls}>More</span>
        </button>
      </ToolbarMenu>

      <ToolbarMenu items={[{ label: "Publish on web" }, { label: "Schedule publish", shortcut: "⌘⇧D" }]}>
        <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow)}>
          <RxRocket className="h-7 w-auto" />
          <RiArrowDownSLine className={arrowClass} />
          <span className={tooltipCls}>Publish</span>
        </button>
      </ToolbarMenu>

      <div className={tx("flex-1", "border-t-upstart-400", baseCls)} />
    </nav>
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

/**
 * Uses DropdownMenu from @enpage/sdk/browser/ui (@radix-ui/themes)
 */
function ToolbarMenu(props: PropsWithChildren<{ items: ToolbarMenuItems }>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none">{props.children}</DropdownMenu.Trigger>
      <DropdownMenu.Content side="left">
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-1.5 h-px bg-black/10" />
          ) : (
            <DropdownMenu.Item key={item.label}>
              <button
                onClick={item.onClick}
                type="button"
                className="group flex justify-start items-center text-nowrap rounded-[inherit]
                py-1.5 w-fulldark:text-white/90 text-left data-[focus]:bg-upstart-600 data-[focus]:text-white "
              >
                <span className="pr-3">{item.label}</span>
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50 dark:text-dark-300
                    group-hover:text-white/90
                      group-data-[focus]:text-white/70 group-data-[active]:text-white/70"
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            </DropdownMenu.Item>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
