import React from "react";
import { applyStyles } from "../applyStyles";
import { CheckboxStyles, type CheckboxVariantProps } from "./CheckboxStyles";

type CheckboxProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledCheckboxProps = CheckboxVariantProps & CheckboxProps;

const Checkbox = ({ children, className, ...props }: StyledCheckboxProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: CheckboxStyles,
    props,
  });
  return <div className={resolvedClassName}>{children}</div>;
};

export default Checkbox;
