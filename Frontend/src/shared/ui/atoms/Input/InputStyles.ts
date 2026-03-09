import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";

// Variant map for Input primitive.
export const InputStyles = {
  base: `rounded-md font-medium
  bg-white placeholder:text-gray-500 placeholder:italic
  focus:placeholder-transparent p-0.5 focus:bg-void-light
focus:border-void outline-none focus:ring-2 focus:ring-void
  disabled:cursor-not-allowed disabled:opacity-50
  border border-void`,
  variants: {
    variant: {},
    hover: optionalVariant({
      true: "hover:bg-slate-700",
    }),
  },
} as const satisfies StyleConfig;

export type InputVariantProps = VariantProps<typeof InputStyles>;
