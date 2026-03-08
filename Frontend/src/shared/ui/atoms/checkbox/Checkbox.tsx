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
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" className={resolvedClassName} {...props} />

      {/* <span className="text-gray-700 peer-checked:text-void">
        Opcja do wyboru
      </span> */}
    </label>
  );
};

export default Checkbox;
