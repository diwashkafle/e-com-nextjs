
interface SalesIconProps {
    size?: string | undefined 
    color?: string | undefined
}

const SalesIcon = ({size,color}:SalesIconProps) => {
  return (
    <p className={`text-gray rounded-full font-bold text-${size}`}>
        रु
    </p>
  )
}

export default SalesIcon