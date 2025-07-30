import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef((props, ref) => {
  const {
    label,
    error,
    helperText,
    className,
    ...rest
  } = props

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-all duration-200",
          error && "border-error focus:ring-error",
          className
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input