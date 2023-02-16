export default function Input({size,className,children,onClick,icon,disabled}){
    return(
        <button className={className} onClick={onClick} disabled>
            {icon}
            {children}
        </button>   
    )
}