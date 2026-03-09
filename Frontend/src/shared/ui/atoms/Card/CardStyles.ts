import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";
// Variant map for Card primitive.
export const CardStyles = {
  base: "rounded-lg shadow-md p-4 bg-white",
  variants: {
    background: optionalVariant({
      lightVoid: "bg-void-light",
    }),
  },
} as const satisfies StyleConfig;

export type CardVariantProps = VariantProps<typeof CardStyles>;
