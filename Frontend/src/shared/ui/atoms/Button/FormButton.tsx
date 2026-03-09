import type { ComponentPropsWithoutRef } from "react";
import BaseButton from "./BaseButton";

type BaseProps = Omit<ComponentPropsWithoutRef<typeof BaseButton>, "type">;

type SubmitProps = {
  type?: "submit";
} & BaseProps;

type ResetProps = {
  type: "reset";
} & BaseProps;

type ButtonProps = {
  type: "button";
} & BaseProps;

export type FormButtonProps = SubmitProps | ResetProps | ButtonProps;

// Form-friendly wrapper with submit as default behavior.
const FormButton = (props: FormButtonProps) => {
  const { type = "submit", ...buttonProps } = props;

  return <BaseButton type={type} {...buttonProps} />;
};

export default FormButton;
