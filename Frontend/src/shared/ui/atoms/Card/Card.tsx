import React from "react";
import { applyStyles } from "../../applyStyles";
import { CardStyles, type CardVariantProps } from "./CardStyles";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledCardProps = CardVariantProps & CardProps;

// Card primitive with optional theme variants.
const Card = ({ children, className, ...props }: StyledCardProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: CardStyles,
    props,
  });
  return <div className={resolvedClassName}>{children}</div>;
};

export default Card;
