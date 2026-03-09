import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";

// Variant map for Label primitive.
export const LabelStyles = {
  base: " px-2 rounded-md font-medium transition-colors",
  variants: {
    variant: {},
    hover: optionalVariant({
      true: "hover:bg-slate-700",
    }),
  },
} as const satisfies StyleConfig;

export type LabelVariantProps = VariantProps<typeof LabelStyles>;
