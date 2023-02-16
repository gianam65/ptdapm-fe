export default function Button({size='md',className,children,onClick,icon}){
    return(
        <button className={className} onClick={onClick}>
            {icon}
            {children}
        </button>   
    )
}