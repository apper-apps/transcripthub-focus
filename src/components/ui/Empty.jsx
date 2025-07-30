import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No items found",
  description = "Get started by adding your first item",
  action,
  actionText = "Get Started",
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button onClick={action} variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionText}
        </Button>
      )}
      
      {/* Decorative Audio Waveform */}
      <div className="flex items-end space-x-1 mt-8 opacity-30">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gray-300 rounded-full"
            style={{ height: `${Math.random() * 16 + 8}px` }}
          />
        ))}
      </div>
    </div>
  )
}

export default Empty