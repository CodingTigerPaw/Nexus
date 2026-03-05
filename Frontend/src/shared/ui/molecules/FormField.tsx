import React from "react";
import Label from "../atoms/Label/Label";
import Input from "../atoms/Input/Input";
import Checkbox from "../atoms/checkbox/Checkbox";

type TextProps = {
  label: string;
  type: "text";
  placeholder?: string;
};

type CheckboxProps = {
  label: string;
  type: "checkbox";
};

type Props = TextProps | CheckboxProps;

const FormField = (props: Props) => {
  const { label, type } = props;
  return (
    <div>
      <Label>{label}</Label>
      {type === "checkbox" ? (
        <Checkbox />
      ) : (
        <Input placeholder={props.placeholder} />
      )}
    </div>
  );
};

export default FormField;
