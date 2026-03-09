import { applyStyles } from "../../applyStyles";
import { AvatarStyles, type AvatarVariantProps } from "./AvatarStyles";

type AvatarProps = {
  className?: string;
  src: string;
  alt: string;
};

type StyledAvatarProps = AvatarVariantProps & AvatarProps;

// Avatar image primitive with variant-driven sizing and theming.
const Avatar = ({ className, src, ...props }: StyledAvatarProps) => {
  const resolvedClassName = applyStyles({
    className,
    config: AvatarStyles,
    props,
  });
  return <img src={src} className={resolvedClassName} {...props} />;
};

export default Avatar;
