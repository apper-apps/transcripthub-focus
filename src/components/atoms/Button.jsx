import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    children,
    className,
    disabled,
    ...rest
  } = props

  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/50",
    secondary: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary/50",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500/50",
    ghost: "text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-500/50",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-lg hover:scale-105 focus:ring-success/50",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white hover:shadow-lg hover:scale-105 focus:ring-warning/50",
    error: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error/50"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button