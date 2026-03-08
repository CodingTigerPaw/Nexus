import React from "react";
import { applyStyles } from "../../applyStyles.ts";
import { LabelStyles, type LabelVariantProps } from "./LabelStyles.ts";

type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledLabelProps = LabelVariantProps & LabelProps;

const Label = ({ children, className, ...props }: StyledLabelProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: LabelStyles,
    props,
  });
  return <label className={resolvedClassName}>{children}</label>;
};

export default Label;
