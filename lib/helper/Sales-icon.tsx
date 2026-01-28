
interface SalesIconProps {
    size?: string | undefined 
    color?: string | undefined
}

const SalesIcon = ({size,color}:SalesIconProps) => {
  return (
    <h1 className={`text-gray rounded-full font-bold text-xl`}>
        रु
    </h1>
  )
}

export default SalesIcon