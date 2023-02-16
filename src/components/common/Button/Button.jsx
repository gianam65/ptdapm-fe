import classNames from 'classnames';
export default function Button({
  size = 'md',
  style,
  outline,
  className,
  children,
  onClick,
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}) {
  return (
    <button
      {...props}
      className={classNames({ btn__default: true, btn__disable: disabled, btn__outline: outline })}
      onClick={onClick}
      disable
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
