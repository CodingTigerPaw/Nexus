import type { InputHTMLAttributes } from "react";
import { applyStyles } from "../../applyStyles.ts";
import { InputStyles, type InputVariantProps } from "./InputStyles.ts";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type StyledInputProps = InputVariantProps & InputProps;

// Input primitive that supports both native and variant props.
const Input = ({ className, ...restProps }: StyledInputProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: InputStyles,
    props: restProps,
  });
  return <input className={resolvedClassName} {...restProps} />;
};

export default Input;
