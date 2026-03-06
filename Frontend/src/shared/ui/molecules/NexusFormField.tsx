import type { ComponentType } from "react";
import type {
  FieldValues,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";

type RegisterInjection<P extends object> =
  | "spread"
  | "inputProps"
  | ((registration: UseFormRegisterReturn<string>) => Partial<P>);

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type NexusFormFieldProps<P extends object> = DistributiveOmit<
  P,
  "name" | "onChange" | "onBlur" | "ref" | "inputProps"
> & {
  molecule: ComponentType<P>;
  register: UseFormRegister<FieldValues>;
  fieldName: string;
  injectRegister?: RegisterInjection<P>;
};

const NexusFormField = <P extends object>({
  molecule: Molecule,
  register,
  fieldName,
  injectRegister = "spread",
  ...props
}: NexusFormFieldProps<P>) => {
  const registration = register(fieldName);

  const injectedProps: Partial<P> =
    injectRegister === "inputProps"
      ? ({ inputProps: registration } as unknown as Partial<P>)
      : injectRegister === "spread"
        ? (registration as unknown as Partial<P>)
        : injectRegister(registration);

  return <Molecule {...({ ...(props as object), ...injectedProps } as P)} />;
};

export default NexusFormField;
