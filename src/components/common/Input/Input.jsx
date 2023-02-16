import classNames from 'classnames';
import './input.scss'
export default function Input({
  size = 'md',
  type,
  value,
  style,
  className,
  onChange,
  disabled = false,
  ...props
}) {
  return (
    <input
      {...props}
      type = {type}
      value = {value}
      style = {style}
      className={classNames({ input__default: true, input__disable: disabled})}
      onChange={onChange}
    />
  );
}
