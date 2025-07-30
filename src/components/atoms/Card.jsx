import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef((props, ref) => {
  const {
    children,
    className,
    hover = false,
    ...rest
  } = props

  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-lg border border-gray-200 transition-all duration-200",
        hover && "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card