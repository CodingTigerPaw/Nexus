import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";
export const CardStyles = {
  base: "rounded-lg shadow-md p-4 bg-white",
  variants: {
    background: optionalVariant({
      red: "bg-red-800",
      blue: "bg-blue-800",
    }),
  },
} as const satisfies StyleConfig;

export type CardVariantProps = VariantProps<typeof CardStyles>;
