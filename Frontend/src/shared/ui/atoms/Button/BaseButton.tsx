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

// className custom nadpisanie styli
// w ...props są wszstkie recznie wpisane style do komponentu
// onClick nie jest uzywany w applyStyles bo nie jest stylem, ale jest potrzebny do buttona

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
