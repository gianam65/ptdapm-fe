export default function Button({size='md',className,children,onClick,icon,disable=false}){
    return(
        <button className={className} onClick={onClick} disablgited>
            {icon}
            {children}
        </button>   
    )
}