import Select from "@mui/material/Select"
import classNames from "classnames"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import "./select.scss"
export default function Selects({
    className,
    defaultValue,
    multiple = false,
    onChange,
    label,
    value,
    sx,
    variant,
    fullWidth,
    inputValue,
    menuValue = [],
    ...props
}) {
    const classes = classNames('select__default', {
        [className]: className,
        sx: sx,

    })
    return (
        <div>
            <FormControl>
                <InputLabel sx={sx}>{inputValue}</InputLabel>
                <Select value={value} label={label} onChange={onChange} multiple={multiple} className={classes} {...props}>
                    {menuValue.map((item, idx) => {
                        return (
                            <MenuItem value={item.name} key={idx}>{item.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
}
