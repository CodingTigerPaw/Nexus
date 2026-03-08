import type { InputHTMLAttributes } from "react";
import Label from "../atoms/Label/Label";
import Input from "../atoms/Input/Input";
import Checkbox from "../atoms/checkbox/Checkbox";

type BaseFieldProps = {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

type TextProps = {
  type: "text";
  placeholder?: string;
} & BaseFieldProps;

type CheckboxProps = {
  type: "checkbox";
  placeholder?: never;
} & BaseFieldProps;

export type FormFieldProps = TextProps | CheckboxProps;

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
