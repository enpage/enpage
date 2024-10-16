import { Fragment, type PropsWithChildren, useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useIsMounted } from "usehooks-ts";
import clsx from "clsx";
import { Button } from "./Button";
import { cn } from "../utils/component-utils";

type ModalProps = PropsWithChildren<{
  title: string;
  primaryAction: string;
  secondaryAction?: string;
  initialOpen?: boolean;
  noBackdrop?: boolean;
  dismissable?: boolean;
  panelClassName?: string;
  delay?: number;
  onClosed?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}>;

export default function Modal({
  initialOpen,
  title,
  onClosed,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  children,
  noBackdrop,
  dismissable,
  delay,
  panelClassName,
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(delay ? false : initialOpen ?? true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (delay) {
      const timeout = setTimeout(() => {
        setIsOpen(true);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  useEffect(() => {
    if (!isMounted()) return;
    if (isOpen === false && onClosed) {
      onClosed();
    }
  }, [isOpen, onClosed, isMounted]);

  return (
    <Transition unmount={true} appear={true} show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => dismissable && setIsOpen(false)}>
        {!noBackdrop && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>
        )}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              unmount={true}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <DialogPanel
                className={cn(
                  `w-full
                max-w-md
                md:max-w-lg
                lg:max-w-xl
                xl:max-w-2xl
                transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800
              p-6 text-left align-middle shadow-2xl transition-all`,
                  panelClassName,
                )}
              >
                <DialogTitle as="h3" className="text-lg font-semibold leading-6 select-none">
                  {title}
                </DialogTitle>
                <div className="mt-3">{children}</div>
                <div
                  className={clsx("mt-6 flex", {
                    "justify-between": secondaryAction,
                    "justify-end": !secondaryAction,
                  })}
                >
                  {secondaryAction && (
                    <Button
                      size="medium"
                      intent="neutral"
                      onClick={() => {
                        setIsOpen(false);
                        onSecondaryAction?.();
                      }}
                    >
                      {secondaryAction}
                    </Button>
                  )}

                  <Button
                    size="medium"
                    intent="primary"
                    onClick={() => {
                      setIsOpen(false);
                      onPrimaryAction?.();
                    }}
                  >
                    {primaryAction}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
