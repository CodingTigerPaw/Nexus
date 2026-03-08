import { twMerge } from "tailwind-merge";

// Uproszczone typy - mniej zagnieżdżonych typów warunkowych
type VariantValueMap = Record<string, string>;

type OptionalVariant<TValues extends VariantValueMap = VariantValueMap> = {
  optional: true;
  values: TValues;
};

type VariantDefinition = VariantValueMap | OptionalVariant;

type VariantDefinitions = Record<string, VariantDefinition>;

export type StyleConfig<
  TVariants extends VariantDefinitions = VariantDefinitions,
> = {
  base?: string;
  variants: TVariants;
};

// Helper type - bardziej czytelny
const isOptionalVariant = (
  variant: VariantDefinition,
): variant is OptionalVariant => "optional" in variant;

// Uproszczone typy inferencji
type VariantValues<T extends VariantDefinition> =
  T extends OptionalVariant<infer U>
    ? U
    : T extends VariantValueMap
      ? T
      : never;

type VariantPropType<T extends VariantDefinition> = [
  keyof VariantValues<T>,
] extends [never]
  ? never
  : keyof VariantValues<T> extends "true" | "false"
    ? boolean
    : keyof VariantValues<T>;

// Bardziej efektywne typowanie kluczy
type VariantKeys<TVariants extends VariantDefinitions, TCondition> = {
  [K in keyof TVariants]: TVariants[K] extends TCondition ? K : never;
}[keyof TVariants];

type OptionalVariantKeys<TVariants extends VariantDefinitions> = VariantKeys<
  TVariants,
  OptionalVariant
>;

type NonEmptyVariantKeys<TVariants extends VariantDefinitions> = {
  [K in keyof TVariants]: VariantPropType<TVariants[K]> extends never
    ? never
    : K;
}[keyof TVariants];

type RequiredVariantKeys<TVariants extends VariantDefinitions> = Exclude<
  Exclude<keyof TVariants, OptionalVariantKeys<TVariants>>,
  Exclude<keyof TVariants, NonEmptyVariantKeys<TVariants>>
>;

type OptionalNonEmptyVariantKeys<TVariants extends VariantDefinitions> =
  Extract<OptionalVariantKeys<TVariants>, NonEmptyVariantKeys<TVariants>>;

export type VariantProps<TConfig extends StyleConfig> =
  // Wymagane warianty
  {
    [K in RequiredVariantKeys<TConfig["variants"]>]: VariantPropType<
      TConfig["variants"][K]
    >;
  } & { // Opcjonalne warianty
    [K in OptionalNonEmptyVariantKeys<TConfig["variants"]>]?: VariantPropType<
      TConfig["variants"][K]
    >;
  };

type ApplyStylesOptions<TVariants extends VariantDefinitions> = {
  className?: string;
  config: StyleConfig<TVariants>;
  props: VariantProps<StyleConfig<TVariants>>;
};

export const optionalVariant = <TValues extends VariantValueMap>(
  values: TValues,
): OptionalVariant<TValues> => ({
  optional: true,
  values,
});

export const applyStyles = <TVariants extends VariantDefinitions>({
  className,
  config,
  props,
}: ApplyStylesOptions<TVariants>) => {
  const classes: string[] = [];

  // Iteracja przez zdefiniowane warianty
  for (const [key, variant] of Object.entries(config.variants)) {
    const value = props[key as keyof typeof props];

    if (value === undefined) continue;

    const variantMap = isOptionalVariant(variant) ? variant.values : variant;
    const variantClass = variantMap[String(value)];

    if (variantClass) {
      classes.push(variantClass);
    }
  }

  return twMerge(config.base, ...classes, className);
};
