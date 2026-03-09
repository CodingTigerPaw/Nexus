import type { ComponentType } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";
import type { ZodTypeAny } from "zod";

type RegisterInjection<P extends object> =
  | "spread"
  | "inputProps"
  | ((registration: UseFormRegisterReturn<string>) => Partial<P>);

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type NexusFormFieldProps<
  P extends object,
  TFieldValues extends FieldValues = FieldValues,
> = DistributiveOmit<
  P,
  "name" | "onChange" | "onBlur" | "ref" | "inputProps"
> & {
  component: ComponentType<P>;
  register: UseFormRegister<TFieldValues>;
  fieldName: Path<TFieldValues>;
  injectRegister?: RegisterInjection<P>;
  validators?: ZodTypeAny | ZodTypeAny[];
};

// Generic bridge between react-hook-form registration and custom UI components.
const NexusFormField = <P extends object, TFieldValues extends FieldValues>({
  component: Component,
  register,
  fieldName,
  injectRegister = "spread",
  validators,
  ...props
}: NexusFormFieldProps<P, TFieldValues>) => {
  // Accept either one validator or a list and evaluate all of them.
  const zodValidators = validators
    ? Array.isArray(validators)
      ? validators
      : [validators]
    : [];

  const registration = register(
    fieldName,
    zodValidators.length > 0
      ? {
          // Aggregates all validation messages into one string for simple display.
          validate: (value) => {
            const errorMessages: string[] = [];

            for (const validator of zodValidators) {
              const result = validator.safeParse(value);
              if (!result.success) {
                const message = result.error.issues[0]?.message;
                if (message) {
                  errorMessages.push(message);
                }
              }
            }

            return errorMessages.length > 0 ? errorMessages.join(" | ") : true;
          },
        }
      : undefined,
  );

  const injectedProps: Partial<P> =
    // Injection mode lets the same wrapper work with different component APIs.
    injectRegister === "inputProps"
      ? ({ inputProps: registration } as unknown as Partial<P>)
      : injectRegister === "spread"
        ? (registration as unknown as Partial<P>)
        : injectRegister(registration);

  return <Component {...({ ...(props as object), ...injectedProps } as P)} />;
};

export default NexusFormField;
