import React from "react";
import { applyStyles } from "../applyStyles";
import { InputStyles, type InputVariantProps } from "./InputStyles.ts";

type InputProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledInputProps = InputVariantProps & InputProps;

const Input = ({ children, className, ...props }: StyledInputProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: InputStyles,
    props,
  });
  return <input className={resolvedClassName}>{children}</input>;
};

export default Input;
