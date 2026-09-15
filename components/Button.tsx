export default function Button({
children,
onClick
}:{
children:React.ReactNode,
onClick?:()=>void
}){

return (

<button
onClick={onClick}
className="
px-10
py-4
rounded-full
bg-gradient-to-r
from-blue-600
to-cyan-400
font-bold
shadow-lg
shadow-blue-500/40
hover:scale-105
transition
"
>

{children}

</button>

)

}