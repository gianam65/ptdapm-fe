import Select from "@mui/material/Select"
import classNames from "classnames"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import "./select.scss"
export default function Selects({
    className,
    defaultValue,
    multiple = false,
    onChange,
    label,
    value,
    defaultOpen,
    sx,
    variant,
    fullWidth,
    inputValue,
    children,
    ...props
}) {
    const classes = classNames('select__default', {
        [className]: className,
        select__input_sx: sx,

    })
    return (
        <div>
            <FormControl>
                <InputLabel sx={sx}>{inputValue}</InputLabel>
                <Select value={value} label={label} onChange={onChange} multiple={multiple} defaultOpen={defaultOpen} className={classes} {...props}>
                    {children}
                </Select>
            </FormControl>
        </div>
    )
}
