export default function BtnCommon(props){
    const {width,height,borderRadius,color,backgroundColor,handleClick,title} = props
    const btnStyle = {
        width: width,
        height: height,
        borderRadius:borderRadius,
        color:color,
        backgroundColor:backgroundColor
    }
    return(
        <button style={btnStyle} onClick={handleClick}>
            {title}
        </button>   
    )
}