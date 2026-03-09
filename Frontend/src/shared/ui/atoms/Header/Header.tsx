import React from "react";
import { applyStyles } from "../../applyStyles";
import { HeaderStyles, type HeaderVariantProps } from "./HeaderStyles";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledHeaderProps = HeaderVariantProps & CardProps;

// Typographic primitive for headings in the design system.
const Header = ({ children, className, ...props }: StyledHeaderProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: HeaderStyles,
    props,
  });
  return <h1 className={resolvedClassName}>{children}</h1>;
};

export default Header;
