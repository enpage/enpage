import type { StylePreset } from "./common";
import type { EffectsSettings, BackgroundSettings, BorderSettings } from "./style-props";

export type StyleProperties = {
  text?: string;
  background: BackgroundSettings;
  border?: BorderSettings;
  effects?: EffectsSettings;
};

export function getPresetStyles({ style, variant }: StylePreset): StyleProperties {
  // Variant-specific color mappings
  const variantColors = {
    primary: {
      bg: "bg-primary-50",
      border: "border-primary-200",
      text: "text-primary-900",
      shadow: "shadow-primary-200/50",
    },
    secondary: {
      bg: "bg-secondary-50",
      border: "border-secondary-200",
      text: "text-secondary-900",
      shadow: "shadow-secondary-200/50",
    },
    accent: {
      bg: "bg-accent-50",
      border: "border-accent-200",
      hover: "hover:border-accent-300",
      text: "text-accent-900",
      shadow: "shadow-accent-200/50",
    },
    neutral: {
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      hover: "hover:border-neutral-300",
      text: "text-neutral-900",
      shadow: "shadow-neutral-200/50",
    },
  };

  function getOtherVariantColor(variant: StylePreset["variant"], alt = false) {
    switch (variant) {
      case "primary":
        return alt ? "accent" : "secondary";
      case "secondary":
        return alt ? "primary" : "accent";
      case "accent":
        return alt ? "secondary" : "primary";
      case "neutral":
        return alt ? "primary" : "accent";
    }
  }

  const styleProperties: Record<StylePreset["style"], StyleProperties> = {
    ghost: {
      background: {
        color: "transparent",
      },
      text: `text-${variant}-900`,
    },
    plain: {
      background: {
        color: `bg-${variant}-600`,
      },
      border: {
        color: `border-${variant}-900`,
        style: "border-solid",
        width: "border",
        radius: "rounded-sm",
      },
      effects: {
        shadow: "shadow-sm",
      },
      text: variant === "neutral" ? "text-neutral-800" : `text-${variant}-50`,
    },
    plain2: {
      background: {
        color: `bg-${variant}-400`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
        radius: "rounded-sm",
      },
      effects: {
        shadow: "shadow-sm",
      },
      text: variant === "neutral" ? "text-neutral-800" : `text-${variant}-50`,
    },
    plain3: {
      background: {
        color: `bg-${variant}-200`,
      },
      border: {
        color: `border-${variant}-500`,
        style: "border-solid",
        width: "border",
        radius: "rounded-sm",
      },
      effects: {
        shadow: "shadow-sm",
      },
      text: variant === "neutral" ? "text-neutral-800" : `text-${variant}-900`,
    },
    callout: {
      background: {
        color: `bg-${variant}-100`,
      },
      border: {
        color: `border-${variant}-400`,
        style: "border-solid",
        width: "border",
        radius: "rounded-lg",
      },
      text: `text-${variant}-900`,
    },
    elevated: {
      background: {
        color: `bg-${variant}-100`,
      },
      effects: {
        shadow: "shadow-lg",
      },
      text: `text-${variant}-900`,
    },
    glass: {
      background: {
        color: `bg-${variant}-50`,
      },
      border: {
        color: variantColors[variant].border,
        style: "border-solid",
        width: "border",
        radius: "rounded-lg",
      },
      effects: {
        shadow: "shadow-sm",
      },
      text: `text-${variant}-900`,
    },
    modern: {
      background: {
        color: `bg-${variant}-100`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
        radius: "rounded-lg",
      },
      text: `text-${variant}-900`,
    },
    modern2: {
      background: {
        color: `bg-${variant}-300`,
      },
      border: {
        color: `border-${variant}-700`,
        style: "border-solid",
        width: "border",
        radius: "rounded-lg",
      },
      text: `text-${variant}-900`,
    },
    soft: {
      background: {
        color: `bg-${variant}-50`,
      },
      border: {
        color: `border-${variant}-300`,
        style: "border-solid",
        width: "border",
        radius: "rounded-lg",
      },
      text: `text-${variant}-800`,
    },
    gradient: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 to-${variant}-50`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
        radius: "rounded-md",
      },
      text: "text-neutral-900",
    },
    gradient2: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 ${variant === "neutral" ? "to-neutral-100" : `to-${getOtherVariantColor(variant)}-200`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
        radius: "rounded-md",
      },
      text: "text-neutral-900",
    },
    gradient3: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-200 ${variant === "neutral" ? "to-neutral-100" : `to-${getOtherVariantColor(variant, true)}-200`}`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
        radius: "rounded-md",
      },
      text: "text-neutral-900",
    },
    gradient4: {
      background: {
        color: `bg-gradient-to-tr from-${variant}-400 to-${variant}-100`,
      },
      border: {
        color: `border-${variant}-200`,
        style: "border-solid",
        width: "border",
        radius: "rounded-md",
      },
      text: "text-neutral-900",
    },
    paper: {
      background: {
        color: `bg-${variant}-50`,
      },
      text: `text-${variant}-800`,
      effects: {
        shadow: "shadow-md",
      },
    },
    outlined: {
      background: {
        color: "bg-transparent",
      },
      border: {
        color: `border-${variant}-600`,
        style: "border-solid",
        width: "border-4",
        radius: "rounded-none",
      },
      text: `text-${variant}-800`,
    },
  };

  return styleProperties[style];
}
