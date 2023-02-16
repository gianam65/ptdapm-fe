import classNames from "classnames";
import './notifyPopup.scss'

export default function NotifyPopup({
    size = "md",
    children,
    style,
    leftIcon,
    rightIcon,
    showNotify,
    ...props
}){
    return(
        <div>
            {showNotify && <div {...props} style={style} 
                className={classNames({ notify__default:true})}>
            {leftIcon}
            {children}
            {rightIcon}
            </div>}
        </div>
    )
}