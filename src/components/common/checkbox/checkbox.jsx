import Checkbox from '@mui/material/Checkbox';
import classNames from 'classnames';
import './checkbox.scss';

export default function Checkboxes({ 
  className,   
  checked, 
  disabled, 
  defaultChecked, 
  onChange, 
  small = false,
  large = false,
  style,
  ...props}) {
  const classes = classNames('checkbox__default',{
    [className] : className,
    checkbox__small: small,
    checkbox__large: large
  })
  return (
    <div>
      <Checkbox style={style} disabled={disabled} checked={checked} className={classes} {...props} onChange={onChange}/>
    </div>
  );
}