import { Fragment, type PropsWithChildren } from "react";
import { Dialog, Transition, TransitionChild, DialogPanel } from "@headlessui/react";
import { cn } from "../utils/component-utils";

type VDrawerProps = PropsWithChildren<{
  className?: string;
  noBackdrop?: boolean;
  dismissable?: boolean;
  showCloseButton?: boolean;
  onClosed?: () => void;
  open: boolean;
}>;

export default function VerticalDrawer({
  onClosed,
  children,
  noBackdrop,
  className,
  dismissable,
  open,
}: VDrawerProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => dismissable && onClosed?.()}>
        {!noBackdrop && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>
        )}
        <div className={cn("fixed left-0 right-0 bottom-0 h-[50dvh] max-h-[50dvh] flex flex-col", className)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 translate-y-full"
          >
            <DialogPanel
              className="w-full relative flex-1
                max-w-md
                md:max-w-lg
                lg:max-w-xl
                xl:max-w-2xl
                transform  rounded-2xl rounded-b-none bg-white
                shadow-[0_-35px_45px_rgba(0,0,0,0.2)] transition-all"
            >
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

type HDrawerProps = PropsWithChildren<{
  id?: string;
  className?: string;
  noBackdrop?: boolean;
  dismissable?: boolean;
  showCloseButton?: boolean;
  from?: "left" | "right";
  onClosed?: () => void;
  open: boolean;
}>;

export function HorizontalDrawer({
  onClosed,
  children,
  className,
  id,
  from = "right",
  open,
  dismissable,
  noBackdrop,
}: HDrawerProps) {
  const enterFrom = from === "right" ? "opacity-0 translate-x-full" : "opacity-0 -translate-x-full";
  const enterTo = from === "right" ? "opacity-100 translate-x-0" : "opacity-100 translate-x-0";
  const leaveTo = from === "right" ? "opacity-0 translate-x-full" : "opacity-0 -translate-x-full";
  const basePosition = from === "right" ? "right-0 justify-right" : "left-0";

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        id={id}
        onClose={() => {
          setTimeout(() => dismissable && onClosed?.(), 0);
        }}
      >
        {!noBackdrop && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>
        )}
        <div
          className={cn(
            basePosition,
            "drawer fixed z-20 top-0 bottom-0 h-dvh max-h-[100dvh] flex w-[75dvw] md:w-[50dvw] max-w-md",
            className,
          )}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-in-elastic duration-200"
            enterFrom={enterFrom}
            enterTo={enterTo}
            leave="ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo={leaveTo}
          >
            {/* max-w-md
                md:max-w-lg
                lg:max-w-xl
                xl:max-w-2xl */}
            <DialogPanel
              className="w-full relative flex-1 dialog-panel

                transform  rounded-2xl rounded-b-none bg-white
                shadow-[0_-35px_45px_rgba(0,0,0,0.2)] transition-all"
            >
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
