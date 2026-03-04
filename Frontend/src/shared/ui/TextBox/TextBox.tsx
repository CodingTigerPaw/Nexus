import React from "react";
import { applyStyles } from "../applyStyles.ts";
import { TextBoxStyles, type TextBoxVariantProps } from "./TextBoxStyles.ts";

type TextBoxProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledTextBoxProps = TextBoxVariantProps & TextBoxProps;

const TextBox = ({ children, className, ...props }: StyledTextBoxProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: TextBoxStyles,
    props,
  });
  return (
    <a className={resolvedClassName} {...props}>
      {children}
    </a>
  );
};

export default TextBox;
