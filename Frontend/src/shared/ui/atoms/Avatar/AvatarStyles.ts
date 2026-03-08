import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";

export const AvatarStyles = {
  base: "rounded-md font-medium transition-colors",
  variants: {
    size: {
      small: "px-2 py-1 text-sm",
      medium: "px-8 py-2 text-base",
      large: "px-6 py-3 text-lg",
    },
    variant: {
      primary:
        "bg-[#281246] border-solid border-[#9D50BB] border-[3px]   text-[#D4AF37]",
      secondary: "bg-slate-200 text-slate-900",
      tertiary: "border border-slate-300 bg-white text-slate-900",
    },
    hover: optionalVariant({
      true: "hover:bg-slate-700",
    }),
  },
} as const satisfies StyleConfig;

export type AvatarVariantProps = VariantProps<typeof AvatarStyles>;
