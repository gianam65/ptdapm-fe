import './notifyPopup.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Notify({
  message,
  success = false,
  warning = false,
  showNotify,
  onCloseNotify,
  className,  
  severity,
  autoHideDuration,
  ...props
}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    onCloseNotify && onCloseNotify()
  };

  return (
   <div>
      <Snackbar open={showNotify} autoHideDuration={autoHideDuration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notify;
