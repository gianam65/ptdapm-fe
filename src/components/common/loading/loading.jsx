import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import classNames from 'classnames';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({
    className,
    ...props
}) {
    const classes = classNames('loading__default', {
        [className]: className,
       
      })
  return (
    <Box className={classes} sx={{ display: 'flex' }}>
      <CircularProgress  />
    </Box>
  );
}