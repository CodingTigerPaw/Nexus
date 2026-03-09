import React from "react";
import { applyStyles } from "../../applyStyles.ts";
import { LinkStyles, type LinkVariantProps } from "./linkStyles.ts";

type LinkProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledLinkProps = LinkVariantProps & LinkProps;

// Styled anchor primitive from the design system.
const Link = ({ children, className, ...props }: StyledLinkProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: LinkStyles,
    props,
  });
  return (
    <a className={resolvedClassName} {...props}>
      {children}
    </a>
  );
};

export default Link;
