import classNames from 'classnames';
import './button.scss'
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
      style={style}
      onClick={onClick}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
