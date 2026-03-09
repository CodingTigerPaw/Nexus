import { applyStyles } from "../../applyStyles";
import { CheckboxStyles, type CheckboxVariantProps } from "./CheckboxStyles";

type CheckboxProps = {
  className?: string;
  label?: string;
};

type StyledCheckboxProps = CheckboxVariantProps & CheckboxProps;

// Custom checkbox built from hidden native input + styled visual marker.
const Checkbox = ({ className, label, ...props }: StyledCheckboxProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: CheckboxStyles,
    props,
  });
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" className={resolvedClassName} {...props} />
      <span className="relative flex h-5 w-5 items-center justify-center rounded-md border border-gray-400 bg-white transition-all duration-300 peer-checked:border-void peer-checked:bg-void peer-focus:ring-2 peer-focus:ring-indigo-300 peer-focus:ring-offset-2">
        <svg
          className="h-4 w-4 scale-0 text-white transition-transform duration-300 peer-checked:scale-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        >
          <path
            d="M20 6L9 17l-5-5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span className="text-gray-700 peer-checked:text-void">{label}</span>
    </label>
  );
};

export default Checkbox;
