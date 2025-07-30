import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef((props, ref) => {
  const {
    variant = "default",
    size = "md",
    children,
    className,
    ...rest
  } = props

  const baseStyles = "inline-flex items-center rounded-full font-medium"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge