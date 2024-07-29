import { LuPlus, LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsTablet } from "react-icons/bs";
import { clsx } from "../utils/component-utils";
import { Fragment, type PropsWithChildren, useCallback } from "react";
import { useEditor } from "../hooks/use-editor-store";
import { IoSettingsOutline } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../creatives/enpage-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { LiaCopy } from "react-icons/lia";
import { Menu, MenuButton, MenuItem, MenuItems, type MenuItemsProps } from "@headlessui/react";
import { useIsLargeDevice, useIsMobileDevice } from "../hooks/use-is-device-type";

export default function Toolbar() {
  const editor = useEditor();
  const isSmallDevice = useIsMobileDevice();
  const isDesktop = useIsLargeDevice();
  // hello

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

  // bg-enpage-600
  const standardBtn = `bg-gradient-to-t from-enpage-600 to-enpage-600/80
                        disabled:hover:from-enpage-600 disabled:hover:to-enpage-600/80
                       hover:from-enpage-700 hover:to-enpage-700/80
   disabled:text-white/40
    disabled:hover:border-l-enpage-500
    hover:border-l-enpage-700
    border-x border-l-enpage-500 border-r-enpage-700 `;

  const rocketBtn = `bg-gradient-to-tr from-orange-500 to-yellow-400
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default";

  const btnClass = `flex flex-auto items-center justify-center py-1.5 px-4 gap-x-0.5
    xl:first:rounded-l-lg xl:last:rounded-r-lg hover:bg-gradient-to-t group relative`;

  const tooltipCls = `absolute -bottom-7 py-0.5 px-2.5 bg-enpage-600/60 left-auto right-auto
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  // const tooltipCls = clsx(
  //   styles["toolbar-tooltip"],
  //   "group-hover:block group-hover:opacity-100 group-hover:translate-y-0",
  // );

  return (
    <nav
      className="xl:mx-auto min-w-fit max-sm:w-full xl:max-w-fit bg-white
                  flex h-[3.6rem]  justify-start shadow-2xl
                  text-xl text-white xl:rounded-lg"
    >
      {isSmallDevice === false && (
        <button type="button" className={clsx("min-w-[140px] px-0.5 order-first", btnClass, standardBtn)}>
          <img src={logo} alt="Enpage" className="h-14 w-auto" />
        </button>
      )}
      <button
        type="button"
        onClick={editor.toggleLibraryVisible}
        className={clsx(btnClass, standardBtn, "max-md:order-10 order-1")}
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
        <button type="button" className={clsx(btnClass, standardBtn, btnWithArrow, "order-2 max-sm:order-3")}>
          <LiaCopy className="h-7 w-auto" />
          {/* <LuMenu className="h-7 w-auto" /> */}
          <RiArrowDownSLine className="h-4 w-4 opacity-60  -mr-1" />
          <span className={tooltipCls}>Pages</span>
        </button>
      </ToolbarMenu>
      <button disabled type="button" className={clsx(btnClass, standardBtn, "order-3 max-md:order-1")}>
        <LuUndo className="h-7 w-auto" />
        <span className={tooltipCls}>Undo</span>
      </button>
      <button disabled type="button" className={clsx(btnClass, standardBtn, "order-4 max-md:order-2")}>
        <LuRedo className="h-7 w-auto" />
        <span className={tooltipCls}>Redo</span>
      </button>
      {isSmallDevice === false && (
        <button type="button" className={clsx(btnClass, standardBtn, "order-5")} onClick={switchPreviewMode}>
          {editor.previewMode === "desktop" && <RxDesktop className="h-7 w-auto" />}
          {editor.previewMode === "mobile" && <RxMobile className="h-7 w-auto" />}
          {editor.previewMode === "tablet" && <BsTablet className="h-7 w-auto" />}
          <span className={tooltipCls}>Switch View</span>
        </button>
      )}

      <button type="button" className={clsx(btnClass, standardBtn, "order-6")}>
        <IoSettingsOutline className="h-7 w-auto" />
        <span className={tooltipCls}>Site settings</span>
      </button>

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
  );
}

type ToolbarMenuItem = {
  label: string;
  shortcut?: string;
  onClick?: () => void;
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
        className="rounded-md bg-white/85 backdrop-blur p-2.5 min-w-44 mt-1 shadow-xl
                  shadow-black/10 origin-top flex flex-col gap-y-px transition duration-[50ms]
                    ease-out data-[closed]:scale-95 data-[closed]:opacity-0 select-none z-[9999]"
      >
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-2 h-px bg-black/10" />
          ) : (
            <MenuItem key={index}>
              <button
                type="button"
                className="group flex items-center text-nowrap rounded-[inherit] gap-5
                py-1.5 px-2.5
                max-sm:py-2.5 max-sm:text-lg
                w-full
                    text-left data-[focus]:bg-enpage-600 data-[focus]:text-white"
              >
                {item.label}
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50
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
