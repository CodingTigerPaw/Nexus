import type { InputHTMLAttributes } from "react";
import Label from "../atoms/Label/Label";
import Input from "../atoms/Input/Input";
import Checkbox from "../atoms/checkbox/Checkbox";

type BaseFieldProps = {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

type TextProps = {
  type: "text" | "password";
  placeholder?: string;
} & BaseFieldProps;

type CheckboxProps = {
  type: "checkbox";
  placeholder?: never;
} & BaseFieldProps;

export type FormFieldProps = TextProps | CheckboxProps;

// UI-level abstraction for the most common labeled input variants.
const FormField = (props: FormFieldProps) => {
  const { label, type, placeholder, inputProps } = props;
  return (
    <div>
      <Label>{label}</Label>
      {type === "checkbox" ? (
        <Checkbox {...inputProps} />
      ) : (
        <Input type={type} placeholder={placeholder} {...inputProps} />
      )}
    </div>
  );
};

export default FormField;
