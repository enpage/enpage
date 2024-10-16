import { type VariantProps, cva } from "class-variance-authority";
import {
  type ComponentProps,
  type ForwardRefExoticComponent,
  type ForwardedRef,
  type RefAttributes,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

export const InnerButton = (
  { color, submit, className, intent, fill, size, animate, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return (
    <button
      suppressHydrationWarning={true}
      type={submit ? "submit" : "button"}
      className={twMerge(buttonVariants({ intent, size, fill, submit, animate, className }))}
      {...props}
    />
  );
};

export const Button: ForwardRefExoticComponent<
  Omit<ComponentProps<"button">, "ref"> & RefAttributes<HTMLButtonElement> & ButtonProps
> = forwardRef(InnerButton);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  submit?: boolean;
}

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "duration-200",
    "border",
    "shadow-sm",
    "active:shadow-none",
  ],
  {
    variants: {
      intent: {
        primary: [
          "active:text-primary-100",
          "focus-visible:outline-primary-600",
          "group-invalid:text-primary-100",
          // "group-invalid:border-primary-200",
          "disabled:text-primary-50",
          "disabled:border-primary-50",
          "border-primary-700/80",
          "bg-primary-600",
          "active:bg-primary-600",
          "hover:bg-primary-700/90",
        ],
        neutral: [
          "border-gray-300",
          "text-gray-700",
          "hover:border-gray-300",
          "dark:hover:border-dark-300",
          "focus-visible:outline-gray-300",
          "disabled:bg-gray-200",
          "disabled:text-gray-400",
        ],
        danger: [
          "bg-red-600",
          "border-red-700",
          "text-white",
          "hover:bg-red-700",
          "focus-visible:outline-red-600",
          "disabled:bg-red-200",
          "disabled:text-red-50",
        ],
        upgrade: ["text-white", "hover:to-orange-400", "border-orange-600"],
      },
      size: {
        xsmall: ["text-xs", "py-1", "px-2", "font-medium", "rounded-md"],
        small: ["text-sm", "py-1.5", "px-2.5", "font-medium", "leading-tight", "rounded-md"],
        medium: ["text-base", "py-1.5", "px-4", "font-medium", "rounded-lg"],
        large: ["text-lg", "py-2", "px-4", "font-semibold", "rounded-lg"],
      },
      submit: {
        true: ["group-invalid:pointer-events-none"],
      },
      fill: {
        solid: [],
        outline: ["bg-transparent"],
      },
      animate: {
        true: ["animate-pump animate-delay-300 animate-twice"],
      },
    },
    compoundVariants: [
      {
        fill: "solid",
        intent: "primary",
        className: [
          "!text-white",
          // "bg-gradient-to-t",
          // "from-primary-600",
          // "to-primary-500",
          // "hover:from-primary-700",
          // "hover:to-primary-500",
          "group-invalid:opacity-50",
          "disabled:opacity-50",
          "disabled:border-primary-200",
          "transition-opacity",
          "duration-100",
        ],
      },
      {
        fill: "solid",
        intent: "upgrade",
        className: ["bg-gradient-to-t", "from-red-500", "to-orange-500"],
      },
      {
        fill: "solid",
        intent: "neutral",
        className: [
          "dark:text-dark-700",
          "bg-gray-100",
          "dark:bg-dark-100",
          "dark:hover:bg-dark-200",
          "hover:bg-gray-200",
          "active:bg-gray-100",
          "focus:bg-gray-100",
          "dark:text-dark-200",
        ],
      },
      {
        fill: "outline",
        intent: "primary",
        className: [
          "text-primary-600",
          "border-primary-600",
          "group-invalid:border-primary-200",
          "disabled:border-primary-200",
          "hover:bg-primary-600",
          "hover:text-white",
        ],
      },
      {
        fill: "outline",
        intent: "neutral",
        className: ["hover:bg-gray-100", "hover:text-black", "dark:text-dark-300"],
      },
      {
        fill: "outline",
        intent: "danger",
        className: [
          "text-red-700",
          "border-red-700",
          "group-invalid:border-red-200",
          "disabled:border-red-200",
          "hover:bg-red-700",
          "hover:text-white",
        ],
      },
      {
        fill: "outline",
        intent: "upgrade",
        className: [
          "text-orange-600",
          "border-orange-600",
          "hover:bg-orange-600",
          "hover:text-white",
          "bg-transparent",
        ],
      },
    ],
    defaultVariants: {
      intent: "primary",
      size: "medium",
      fill: "solid",
      animate: false,
    },
  },
);
