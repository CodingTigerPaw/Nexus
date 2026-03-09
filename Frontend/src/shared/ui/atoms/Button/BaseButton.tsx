import type { ButtonHTMLAttributes, ReactNode } from "react";
import { applyStyles } from "../../applyStyles";
import { buttonStyles, type ButtonVariantProps } from "./BaseButtonStyles";

//TODO osobny typ buttonProps z propsami funkcjoonalnami jak children onClick itp

type BaseButtonProps = ButtonVariantProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    className?: string;
    children?: ReactNode;
    icon?: string;
  };

// Primitive button that composes visual variants with native button props.

const BaseButton = ({
  className,
  children,
  type = "button",
  ...props
}: BaseButtonProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: buttonStyles,
    props,
  });

  return (
    <button className={resolvedClassName} type={type} {...props}>
      {children}
    </button>
  );
};

export default BaseButton;
