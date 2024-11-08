import { LuPlus } from "react-icons/lu";
import { PiPalette } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { type MouseEvent, type PropsWithChildren, useCallback, useMemo } from "react";
import { useDraftUndoManager, useEditor, useAttributes } from "../hooks/use-editor";
import { tx, css } from "@enpage/style-system/twind";
import { DropdownMenu } from "@enpage/style-system";

export default function Toolbar() {
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
  const baseCls = `bg-gradient-to-r from-transparent to-[rgba(255,255,255,0.15)] border-y border-t-gray-200 border-b-gray-300`;
  const commonCls = `${baseCls}
    w-full
    hover:(from-upstart-600 to-upstart-500 text-white)
    active:(from-upstart-700 to-upstart-500 text-white)
    disabled:text-gray-400/80 disabled:hover:from-transparent disabled:hover:to-transparent
  `;

  const btnWithArrow = "cursor-default";

  const btnClass = `flex items-center justify-center py-3 gap-x-0.5 aspect-square group relative disabled:hover:cursor-default`;

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/90 left-[calc(100%+.5rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-x-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-x-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60  -mr-3.5 -ml-1";

  return (
    <nav
      role="toolbar"
      className={tx(
        `bg-gray-200 z-[9999]
          flex flex-col w-[3.7rem] text-xl text-gray-600
          border-r border-gray-300`,
        {
          "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.08)]": !editor.panel,
        },
        css({
          gridArea: "toolbar",
        }),
      )}
    >
      <div className={tx("flex-1", baseCls)} />

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
      {/* <button disabled={!canUndo} onClick={() => undo()} type="button" className={tx(btnClass, commonCls)}>
        <LuUndo className="h-7 w-auto" />
        <span className={tooltipCls}>Undo</span>
      </button>
      <button disabled={!canRedo} onClick={() => redo()} type="button" className={tx(btnClass, commonCls)}>
        <LuRedo className="h-7 w-auto" />
        <span className={tooltipCls}>Redo</span>
      </button> */}
      {/* <button type="button" className={tx(btnClass, commonCls)} onClick={switchPreviewMode}>
        {editor.previewMode === "desktop" && <RxDesktop className="h-7 w-auto" />}
        {editor.previewMode === "mobile" && <RxMobile className="h-7 w-auto" />}
        {editor.previewMode === "tablet" && <BsTablet className="h-7 w-auto" />}
        <span className={tooltipCls}>Switch View</span>
      </button> */}

      <button
        type="button"
        className={tx(btnClass, commonCls)}
        onClick={(e) => {
          editor.togglePanel("theme");
        }}
      >
        <PiPalette className="h-7 w-auto" />
        <span className={tooltipCls}>Color theme</span>
      </button>

      <button
        type="button"
        className={tx(btnClass, commonCls)}
        onClick={(e) => {
          editor.togglePanel("settings");
        }}
      >
        <VscSettings className="h-7 w-auto" />
        <span className={tooltipCls}>Settings</span>
      </button>

      {/* <ToolbarMenu items={[{ label: "Create new page" }, { type: "separator" }, { label: "View all pages" }]}>
        <button type="button" className={tx(btnClass, commonCls, btnWithArrow)}>
          <VscCopy className="h-7 w-auto" />
          <span className={tooltipCls}>Pages</span>
        </button>
      </ToolbarMenu> */}

      <div className={tx("flex-1", "border-t-gray-200")} />
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
