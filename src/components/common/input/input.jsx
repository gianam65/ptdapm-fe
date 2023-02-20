import classNames from 'classnames';
import './input.scss';

function Input({
  type,
  value,
  placeholder,
  onChange,
  large = false,
  medium = false,
  small = false,
  className,
  name,
  ...props
}) {
  const classes = classNames('input__default', {
    [className]: className,
    input__default: small,
    input__medium: medium,
    input__large: large
  });

  return (
    <div>
      <input 
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        className={classes}
        {...props}
      />
    </div>
  );
}

export default Input;
