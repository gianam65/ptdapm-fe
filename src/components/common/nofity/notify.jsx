import './notify.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';
import classNames from 'classnames';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Notify({
  message,
  success = false,
  warning = false,
  showNotify,
  onClose,
  className,
  severity, // success || errorr || warning
  autoHideDuration,
  position = 'top right',
  ...props
}) {
  const getPositionNotify = () => {
    if (!position) return {};
    const [vertical, horizontal] = position.split(' ');

    return { vertical: vertical || 'top', horizontal: horizontal || 'right' };
  };

  return (
    <div
      className={classNames('notify__container', {
        [className]: className
      })}
    >
      <Snackbar
        anchorOrigin={getPositionNotify()}
        open={showNotify}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        {...props}
      >
        <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notify;
