import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading...", showWaveform = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {showWaveform ? (
        <div className="flex items-end space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar w-1 bg-primary rounded-full"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      ) : (
        <div className="w-8 h-8 mb-4">
          <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      <p className="text-gray-600 text-center">{message}</p>
      
      {/* Skeleton Content */}
      <div className="w-full max-w-md mt-8 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer w-full" />
              <div className="h-3 bg-gray-200 rounded shimmer w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading