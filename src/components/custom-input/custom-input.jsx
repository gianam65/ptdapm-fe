import './custom-input.scss';
import { Input } from 'antd';
import { forwardRef } from 'react';
import classNames from 'classnames';

const CustomInput = ({ type = 'text', customClass, ...props }, ref) => {
  return (
    <div
      className={classNames('custom__input-container', {
        [customClass]: customClass
      })}
    >
      {type === 'password' ? <Input.Password {...props} ref={ref} /> : <Input ref={ref} {...props} />}
    </div>
  );
};

export default forwardRef(CustomInput);
