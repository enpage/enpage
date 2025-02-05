import { LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
import { RxDesktop } from "react-icons/rx";
import { BsStars } from "react-icons/bs";
import { VscCopy } from "react-icons/vsc";
import { type MouseEvent, type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import {
  useDraftUndoManager,
  useEditor,
  usePagesInfo,
  useEditorMode,
  usePageVersion,
  useLastSaved,
  useDraft,
  useEditorHelpers,
  usePreviewMode,
} from "~/editor/hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { DropdownMenu, TextField, Popover, AlertDialog, Button, Flex } from "@upstart.gg/style-system/system";
import { post } from "~/editor/utils/api/base-api";
import { IoIosSave } from "react-icons/io";
import { formatDistance } from "date-fns";

export default function TopBar() {
  const editorHelpers = useEditorHelpers();
  const previewMode = usePreviewMode();
  const draft = useDraft();
  const editorMode = useEditorMode();
  const pageVersion = usePageVersion();
  const lastSaved = useLastSaved();
  const pages = usePagesInfo();
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);
  const currentPageLabel = pages.find((page) => page.id === draft.id)?.label;

  const publish = useCallback(
    (wholeSite = false) => {
      post(`/sites/${draft.siteId}/pages/${draft.id}/versions/${pageVersion}/publish`, {});
    },
    [draft.siteId, draft.id, pageVersion],
  );

  const switchPreviewMode = useCallback(() => {
    editorHelpers.setPreviewMode(previewMode === "mobile" ? "desktop" : "mobile");
  }, [previewMode, editorHelpers.setPreviewMode]);

  useEffect(() => {
    if (showSaveAlert) {
      editorHelpers.onShowLogin();
    }
  }, [showSaveAlert, editorHelpers.onShowLogin]);

  // bg-upstart-600
  const baseCls = `bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)] px-3 min-w-[3.7rem]`;
  const commonCls = `${baseCls}
  border-x border-l-upstart-400 border-r-upstart-700
    disabled:hover:from-transparent disabled:hover:to-[rgba(255,255,255,0.15)]
    hover:from-upstart-700 hover:to-white/10
    active:from-upstart-800 active:to-transparent
    disabled:text-white/40
  `;

  const rocketBtn = `px-3 bg-gradient-to-tr from-orange-500 !to-yellow-400 border-l border-l-orange-300
  hover:bg-gradient-to-tr hover:from-orange-600 hover:to-yellow-500`;

  const btnWithArrow = "cursor-default !aspect-auto";

  const btnClass = `flex items-center justify-center py-3 gap-x-0.5 px-3.5  group relative
  focus-visible:outline-none disabled:hover:cursor-default `;

  const squareBtn = "aspect-square";

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/80 top-[calc(100%+.5rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1.5
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60 -ml-0.5";

  return (
    <>
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
          disabled={editorMode === "local"}
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className={tx(baseCls, "flex-shrink-0")}
        >
          <img src={logo} alt="Upstart" className={tx("h-8 w-auto")} />
        </button>

        <div className={tx(baseCls, "px-5 max-lg:hidden flex-1", css({ paddingBlock: "0.6rem" }))}>
          <Popover.Root>
            <Popover.Trigger>
              <button type="button" className="w-full">
                <TextField.Root
                  placeholder="Ask AI to modify your page"
                  size="3"
                  className={tx(
                    "focus:!outline-white/40 focus-within:!outline-white/40 flex-1 w-full !border-transparent !shadow-none !bg-white",
                  )}
                >
                  <TextField.Slot>
                    <BsStars className="w-5 h-5 text-upstart-400" />
                  </TextField.Slot>
                </TextField.Root>
              </button>
            </Popover.Trigger>
            <Popover.Content onOpenAutoFocus={(e) => e.preventDefault()} side="bottom" size="1">
              <div className="text-sm flex flex-col gap-2.5">
                <h3 className="text-sm2 font-semibold uppercase">Prompt Examples</h3>
                <strong>Generate elements:</strong>
                <ul className="italic list-outside list-disc leading-5 ml-4">
                  <li>
                    <q>Add a hero section with a call to action</q>
                  </li>
                  <li>
                    <q>Add a testimonial section</q>
                  </li>
                  <li>
                    <q>Add a contact form with name, email and company name</q>
                  </li>
                </ul>
                <strong>Modify your theme:</strong>
                <ul className="italic list-outside list-disc leading-5 ml-4">
                  <li>
                    <q>Modify my theme with lighter colors</q>
                  </li>
                </ul>
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>

        <button
          disabled={!canUndo}
          onClick={() => {
            undo();
          }}
          type="button"
          className={tx(btnClass, commonCls, squareBtn, "ml-auto")}
        >
          <LuUndo className="h-7 w-auto" />
          <span className={tx(tooltipCls)}>Undo</span>
        </button>
        <button
          disabled={!canRedo}
          onClick={() => redo()}
          type="button"
          className={tx(btnClass, squareBtn, commonCls)}
        >
          <LuRedo className="h-7 w-auto" />
          <span className={tx(tooltipCls)}>Redo</span>
        </button>
        <button type="button" className={tx(btnClass, squareBtn, commonCls)} onClick={switchPreviewMode}>
          {previewMode === "desktop" && <RxDesktop className="h-7 w-auto" />}
          {previewMode === "mobile" && <RxMobile className="h-7 w-auto" />}
          <span className={tx(tooltipCls)}>Switch View</span>
        </button>

        {(editorMode === "remote" || (editorMode === "local" && pages.length > 1)) && (
          <TopbarMenu
            items={[
              ...(editorMode === "remote"
                ? [{ label: "New page" }, { label: "Duplicate page" }, { type: "separator" as const }]
                : []),

              ...(pages.length > 1 ? [{ type: "label", label: "Switch page" } as const] : []),
              ...(pages.length > 1
                ? pages.map((page) => ({
                    label: page.label,
                    type: "checkbox" as const,
                    checked: draft.id === page.id || draft.path === page.path,
                    onClick: () => {
                      if (editorMode === "remote") {
                        window.location.href = `/editor/sites/${draft.siteId}/pages/${page.id}/edit`;
                      } else {
                        const currentURL = new URL(window.location.href);
                        currentURL.searchParams.set("p", page.id);
                        window.location.href = currentURL.href;
                      }
                    },
                  }))
                : []),
            ]}
          >
            <button type="button" className={tx(btnClass, squareBtn, commonCls, btnWithArrow)}>
              <VscCopy className="h-7 w-auto" />
              <div className="flex flex-col gap-1 ml-2 mr-3 justify-start items-start">
                <span className="text-xs inline-block">Page</span>
                <span className="text-base inline-block -mt-2 font-semibold">{currentPageLabel}</span>
              </div>
              <RiArrowDownSLine className={tx(arrowClass)} />
            </button>
          </TopbarMenu>
        )}

        <div className={tx("flex-1", "border-x border-l-upstart-400 border-r-upstart-700", baseCls)} />

        <div className={tx(btnClass, baseCls, "border-x border-l-upstart-400 border-r-upstart-700 px-8")}>
          {lastSaved ? (
            <div className={tx("text-sm")}>
              Last saved {formatDistance(lastSaved, new Date(), { addSuffix: true })}
            </div>
          ) : (
            <div className={tx("text-sm")}>No saved yet</div>
          )}
        </div>

        {editorMode === "remote" ? (
          <TopbarMenu
            items={[
              { label: "Publish this page", onClick: () => publish() },
              { label: "Publish the whole site", onClick: () => publish(true) },
              { label: "Schedule publish", shortcut: "⌘⇧D" },
            ]}
          >
            <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow, "px-4")}>
              <RxRocket className={tx("h-6 w-auto")} />
              <span className={tx("font-bold italic px-2", css({ fontSize: "1.2rem" }))}>Publish</span>
              <RiArrowDownSLine className={arrowClass} />
            </button>
          </TopbarMenu>
        ) : (
          <button
            type="button"
            className={tx(btnClass, rocketBtn, "px-4")}
            onClick={() => {
              setShowSaveAlert(true);
            }}
          >
            <IoIosSave className={tx("h-5 w-auto")} />
            <span className={tx("font-bold italic px-2", css({ fontSize: "1.2rem" }))}>Save</span>
          </button>
        )}
      </nav>
      {showSaveAlert && (
        <AlertDialog.Root defaultOpen={showSaveAlert} onOpenChange={setShowSaveAlert}>
          <AlertDialog.Content maxWidth="480px">
            <AlertDialog.Title>Redirecting to sign-up page</AlertDialog.Title>
            <AlertDialog.Description size="3" className="pb-2">
              Save your progress by creating an account.
              <br />
              Once registered, this page will be saved to your account where you can continue editing and
              publish when ready.
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={() => {
                  window.location.href = "/sign-up/?next=/dashboard/first-site-setup";
                }}
              >
                <Button variant="solid" color="violet">
                  Sign up
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}
    </>
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
type TopbarMenuLabel = {
  type: "label";
  label: string;
};

type TopbarMenuItems = (TopbarMenuItem | TopbarMenuSeparator | TopbarMenuLabel | TopbarMenuCheckbox)[];

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
          ) : item.type === "label" ? (
            <DropdownMenu.Label key={item.label}>{item.label}</DropdownMenu.Label>
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
