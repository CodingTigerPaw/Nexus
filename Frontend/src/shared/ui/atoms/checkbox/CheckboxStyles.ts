import {
  optionalVariant,
  type StyleConfig,
  type VariantProps,
} from "../../applyStyles";
// Variant map for hidden native checkbox input element.
export const CheckboxStyles = {
  base: " rounded-lg shadow-md p-4 bg-white  peer hidden",
  variants: {
    background: optionalVariant({
      red: "bg-red-800",
      blue: "bg-blue-800",
    }),
  },
} as const satisfies StyleConfig;

export type CheckboxVariantProps = VariantProps<typeof CheckboxStyles>;
