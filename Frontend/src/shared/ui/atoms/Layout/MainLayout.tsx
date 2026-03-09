import React from "react";
import { applyStyles } from "../../applyStyles.ts";
import {
  MainLayoutStyles,
  type MainLayoutVariantProps,
} from "./MainLayoutStyles.ts";

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

type StyledMainLayoutProps = MainLayoutVariantProps & MainLayoutProps;

// Page/container primitive for high-level layout composition.
const MainLayout = ({
  children,
  className,
  ...props
}: StyledMainLayoutProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: MainLayoutStyles,
    props,
  });
  return <div className={resolvedClassName}>{children}</div>;
};

export default MainLayout;
