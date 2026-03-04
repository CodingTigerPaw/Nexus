import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../applyStyles";

export const HeaderStyles = {
  base: "rounded-md font-medium transition-colors",
  variants: {
    size: {
      small: "px-2 py-1 text-sm",
      medium: "px-8 py-2 text-base",
      large: "px-6 py-3 text-lg",
    },
    variant: {},
    hover: optionalVariant({
      true: "hover:bg-slate-700",
    }),
  },
} as const satisfies StyleConfig;

export type HeaderVariantProps = VariantProps<typeof HeaderStyles>;
