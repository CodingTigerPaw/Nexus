import { applyStyles } from "../applyStyles";
import { buttonStyles, type ButtonVariantProps } from "./BaseButtonStyles";

//TODO osobny typ buttonProps z propsami funkcjoonalnami jak children onClick itp

// podstawowe typy dla componentu rozszerzone o style
type BaseButtonProps = ButtonVariantProps & {
  className?: string;
  icon?: string;
  onClick: () => void;
};

// className custom nadpisanie styli
// w ...props są wszstkie recznie wpisane style do komponentu
// onClick nie jest uzywany w applyStyles bo nie jest stylem, ale jest potrzebny do buttona

const BaseButton = ({ className, onClick, ...props }: BaseButtonProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: buttonStyles,
    props,
  });

  return (
    <button className={resolvedClassName} onClick={onClick} type="button">
      Button
    </button>
  );
};

export default BaseButton;
