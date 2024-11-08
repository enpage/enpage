import { LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsTablet } from "react-icons/bs";
import { BsStars } from "react-icons/bs";
import { VscCopy } from "react-icons/vsc";
import { type MouseEvent, type PropsWithChildren, useCallback, useMemo } from "react";
import { useDraftUndoManager, useEditor, useAttributes, usePagesInfo } from "~/hooks/use-editor";
import { tx, css } from "@enpage/style-system/twind";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { DropdownMenu, TextField } from "@enpage/style-system";

export default function TopBar() {
  const editor = useEditor();
  const attributes = useAttributes();
  const pages = usePagesInfo();
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
  const baseCls = `bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)] px-3 min-w-[3.7rem]`;
  const commonCls = `${baseCls}
  border-x border-l-upstart-400 border-r-upstart-700
    disabled:hover:from-transparent disabled:hover:to-[rgba(255,255,255,0.15)]
    hover:from-upstart-700 hover:to-white/10
    active:from-upstart-800 active:to-transparent
    disabled:text-white/40
  `;

  const rocketBtn = `px-3 bg-gradient-to-tr from-orange-500 to-yellow-400 border-l border-l-orange-300
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default !aspect-auto";

  const btnClass = `flex items-center justify-center py-3 gap-x-0.5 px-3.5  group relative disabled:hover:cursor-default aspect-square`;

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/80 top-[calc(100%+.5rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60 -ml-0.5";

  return (
    <nav
      role="navigation"
      className={tx(
        `bg-upstart-600 z-[9999] shadow-xl
          flex text-xl text-white w-full justify-start items-stretch
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

      <div className={tx(baseCls, "px-5", css({ paddingBlock: "0.6rem" }))}>
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
          ...pages.map((page) => ({
            label: page.label,
            type: "checkbox" as const,
            checked: editor.pageConfig.id === page.id,
            onClick: () => {
              window.location.href = `/sites/${editor.pageConfig.siteId}/pages/${page.id}/edit`;
            },
          })),
        ]}
      >
        <button type="button" className={tx(btnClass, commonCls, btnWithArrow)}>
          <VscCopy className="h-7 w-auto" />
          <span className={tooltipCls}>Pages</span>
          <RiArrowDownSLine className={arrowClass} />
        </button>
      </TopbarMenu>

      <div className={tx("flex-1", "border-x border-l-upstart-400 border-r-upstart-700", baseCls)} />

      <TopbarMenu items={[{ label: "Publish on web" }, { label: "Schedule publish", shortcut: "⌘⇧D" }]}>
        <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow, "px-4")}>
          <RxRocket className="h-7 w-auto" />
          <span className="text-base font-bold px-2">Publish</span>
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

type TopbarMenuCheckbox = {
  label: string;
  checked: boolean;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type: "checkbox";
};

type TopbarMenuSeparator = {
  type: "separator";
};

type TopbarMenuItems = (TopbarMenuItem | TopbarMenuSeparator | TopbarMenuCheckbox)[];

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
          ) : item.type === "checkbox" ? (
            <DropdownMenu.CheckboxItem key={item.label} checked={item.checked}>
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
            </DropdownMenu.CheckboxItem>
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
