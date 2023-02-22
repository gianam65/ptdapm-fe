import React from 'react'
import classNames from "classnames"
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import './dateSelect.scss'
export default function DateSelect({
    className,
    label,
    type = 'date',
    defaultValue,
    sx,
    onChange,
    disabled = false,
    loading,
    value,
    views,
    ...props
}) {
    const classes = classNames('dateSelect__default', {
        [className]: className,
        dateSelect__size: sx
    })
    return (
        <div>
            <Stack component="form" noValidate spacing={3}>
                <TextField
                    id="date"
                    className={classes}
                    label={label}
                    type={type}
                    defaultValue={defaultValue}
                    value={value}
                    views={views}
                    sx={sx}
                    loading= {loading}
                    onChange = {onChange}
                    {...props}
                />
            </Stack>
        </div>
    )
}
