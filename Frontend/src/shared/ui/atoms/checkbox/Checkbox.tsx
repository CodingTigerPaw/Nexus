import { applyStyles } from "../../applyStyles";
import { CheckboxStyles, type CheckboxVariantProps } from "./CheckboxStyles";

type CheckboxProps = {
  className?: string;
};

type StyledCheckboxProps = CheckboxVariantProps & CheckboxProps;

const Checkbox = ({ className, ...props }: StyledCheckboxProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: CheckboxStyles,
    props,
  });
  return <input type="checkbox" className={resolvedClassName} {...props} />;
};

export default Checkbox;
