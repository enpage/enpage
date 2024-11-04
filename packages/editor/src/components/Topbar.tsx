import { LuPlus, LuUndo, LuRedo, LuPalette } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsTablet } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { PiPalette } from "react-icons/pi";
import SettingsModal from "./SettingsPanel";
import { BsStars } from "react-icons/bs";
// import { clsx } from "../utils/component-utils";
import { VscLayoutSidebarLeft, VscLayoutSidebarRight, VscCopy, VscHome, VscSettings } from "react-icons/vsc";
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
import { useDraft, useDraftUndoManager, useEditor, useAttributes } from "@enpage/sdk/browser/use-editor";
import { tx, css } from "@enpage/sdk/browser/twind";
import { IoSettingsOutline } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { LiaCopy } from "react-icons/lia";
import { useIsLargeDevice, useIsMobileDevice } from "../hooks/use-is-device-type";
import { TiArrowUp } from "react-icons/ti";
import { VscLayoutPanelOff } from "react-icons/vsc";
import { Tooltip, DropdownMenu, Dialog, TextField } from "@enpage/style-system";
import { BiDotsVerticalRounded } from "react-icons/bi";

export default function TopBar() {
  const editor = useEditor();
  const attributes = useAttributes();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();

  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);

  const switchPreviewMode = useCallback(() => {
    switch (editor.previewMode) {
      case "desktop":
        if (attributes.$tabletBreakpointEnabled) {
          editor.setPreviewMode("tablet");
        } else {
          editor.setPreviewMode("mobile");
        }
        break;
      case "tablet":
        editor.setPreviewMode("mobile");
        break;
      case "mobile":
        editor.setPreviewMode("desktop");
        break;
    }
  }, [editor.previewMode, editor.setPreviewMode, attributes.$tabletBreakpointEnabled]);

  // bg-upstart-600
  const baseCls = `bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)] px-2.5 min-w-[3.7rem]`;
  const commonCls = `${baseCls}
  border-x border-l-upstart-400 border-r-upstart-700
    disabled:hover:from-upstart-600 disabled:hover:to-upstart-600/80
    hover:from-upstart-700 hover:to-white/10
    active:from-upstart-800 active:to-transparent
    disabled:text-white/40 disabled:hover:border-t-upstart-400 disabled:hover:from-transparent disabled:hover:to-white/10
  `;

  const rocketBtn = `px-3 bg-gradient-to-tr from-orange-500 to-yellow-400 border-x border-l-orange-300 border-r-orange-600
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default";

  const btnClass = `flex items-center justify-center py-3 gap-x-0.5  group relative disabled:hover:cursor-default aspect-square`;

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/80 top-[calc(100%+.5rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60 -ml-1";

  return (
    <nav
      role="navigation"
      className={tx(
        `bg-upstart-600 z-[9999] shadow-xl
          flex text-xl text-white w-full justify-start
          `,
        css({
          gridArea: "topbar",
        }),
      )}
    >
      <button
        type="button"
        disabled={false}
        onClick={() => {
          window.location.href = "/dashboard";
        }}
        className={tx(baseCls)}
      >
        <img src={logo} alt="Upstart" className="h-9 w-auto" />
      </button>

      <div className={tx("py-2", baseCls, "px-5")}>
        <TextField.Root
          placeholder="Ask AI to generate elements or modify your page"
          size="3"
          className={tx(" focus:!bg-white focus-within:!bg-white", css({ width: "30rem" }))}
        >
          <TextField.Slot>
            <BsStars className="w-5 h-5 text-upstart-400" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <div className={tx("border-r border-r-upstart-700", baseCls)} />

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

      <TopbarMenu
        items={[
          { label: "New page" },
          { label: "Duplicate page" },
          { type: "separator" },
          { label: "View all pages" },
        ]}
      >
        <button type="button" className={tx(btnClass, commonCls, btnWithArrow)}>
          <VscCopy className="h-7 w-auto" />
          <span className={tooltipCls}>Pages</span>
        </button>
      </TopbarMenu>

      <div className={tx("flex-1", "border-x border-l-upstart-400 border-r-upstart-700", baseCls)} />

      <TopbarMenu items={[{ label: "Publish on web" }, { label: "Schedule publish", shortcut: "⌘⇧D" }]}>
        <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow, "px-4 !aspect-auto")}>
          <RxRocket className="h-7 w-auto" />
          <span className="text-base font-bold px-2 uppercase">Publish</span>
          <RiArrowDownSLine className={arrowClass} />
        </button>
      </TopbarMenu>
    </nav>
  );
}

type TopbarMenuItem = {
  label: string;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type?: never;
};

type TopbarMenuSeparator = {
  type: "separator";
};

type TopbarMenuItems = (TopbarMenuItem | TopbarMenuSeparator)[];

/**
 */
function TopbarMenu(props: PropsWithChildren<{ items: TopbarMenuItems }>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none">{props.children}</DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom">
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
