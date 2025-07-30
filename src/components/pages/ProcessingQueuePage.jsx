import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { audioFileService } from "@/services/api/audioFileService"
import { formatFileSize, formatDuration, formatDate } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const ProcessingQueuePage = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all") // all, queued, processing, completed, failed

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const filesData = await audioFileService.getAll()
      setFiles(filesData)
    } catch (err) {
      setError("Failed to load processing queue. Please try again.")
      console.error("Error loading queue:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Poll for updates every 5 seconds
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRetryFile = async (fileId) => {
    try {
      const updatedFile = await audioFileService.update(fileId, { status: "queued" })
      setFiles(prev => prev.map(f => f.Id === fileId ? updatedFile : f))
      toast.success("File queued for retry")
    } catch (err) {
      toast.error("Failed to retry file")
      console.error("Retry error:", err)
    }
  }

  const handleCancelFile = async (fileId) => {
    try {
      await audioFileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.Id !== fileId))
      toast.success("File removed from queue")
    } catch (err) {
      toast.error("Failed to cancel file")
      console.error("Cancel error:", err)
    }
  }

  const filteredFiles = files.filter(file => {
    if (filter === "all") return true
    return file.status === filter
  })

  const stats = {
    total: files.length,
    queued: files.filter(f => f.status === "queued").length,
    processing: files.filter(f => f.status === "processing").length,
    completed: files.filter(f => f.status === "completed").length,
    failed: files.filter(f => f.status === "failed").length
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle"
      case "processing":
        return "Clock"
      case "failed":
        return "XCircle"
      case "queued":
        return "Clock"
      default:
        return "FileAudio"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "warning"
      case "failed":
        return "error"
      case "queued":
        return "info"
      default:
        return "default"
    }
  }

  if (loading) {
    return <Loading message="Loading processing queue..." showWaveform />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Queue</h1>
        <p className="text-gray-600">
          Monitor the transcription progress of your audio files
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatsCard
          title="Total Files"
          value={stats.total}
          icon="Files"
          color="bg-gradient-to-br from-gray-500 to-gray-600"
          isActive={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <StatsCard
          title="Queued"
          value={stats.queued}
          icon="Clock"
          color="bg-gradient-to-br from-info to-blue-600"
          isActive={filter === "queued"}
          onClick={() => setFilter("queued")}
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon="Loader2"
          color="bg-gradient-to-br from-warning to-orange-600"
          isActive={filter === "processing"}
          onClick={() => setFilter("processing")}
          animated
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon="CheckCircle"
          color="bg-gradient-to-br from-success to-emerald-600"
          isActive={filter === "completed"}
          onClick={() => setFilter("completed")}
        />
        <StatsCard
          title="Failed"
          value={stats.failed}
          icon="XCircle"
          color="bg-gradient-to-br from-error to-red-600"
          isActive={filter === "failed"}
          onClick={() => setFilter("failed")}
        />
      </div>

      {/* Queue List */}
      {filteredFiles.length === 0 ? (
        <Empty
          title={filter === "all" ? "No files in queue" : `No ${filter} files`}
          description={
            filter === "all" 
              ? "Upload some audio files to see them in the processing queue"
              : `There are no files with status "${filter}" at the moment`
          }
          icon="Clock"
        />
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <ProcessingCard
              key={file.Id}
              file={file}
              onRetry={() => handleRetryFile(file.Id)}
              onCancel={() => handleCancelFile(file.Id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const StatsCard = ({ title, value, icon, color, isActive, onClick, animated = false }) => (
  <Card
    hover
    className={cn(
      "p-4 cursor-pointer transition-all duration-200",
      isActive && "ring-2 ring-primary ring-offset-2"
    )}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
        <ApperIcon 
          name={icon} 
          className={cn("w-6 h-6 text-white", animated && "animate-spin")} 
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  </Card>
)

const ProcessingCard = ({ file, onRetry, onCancel }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (file.status === "processing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 95 ? 95 : newProgress
        })
      }, 1000)
      return () => clearInterval(interval)
    } else if (file.status === "completed") {
      setProgress(100)
    } else {
      setProgress(0)
    }
  }, [file.status])

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        {/* File Icon */}
        <div className={cn(
          "w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0",
          file.status === "processing" ? "processing-pulse" : "bg-gradient-to-br from-primary to-secondary"
        )}>
          <ApperIcon 
            name={getStatusIcon(file.status)} 
            className="w-8 h-8 text-white" 
          />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {file.name}
            </h3>
            <Badge variant={getStatusColor(file.status)}>
              {file.status}
            </Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>{formatDuration(file.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="HardDrive" className="w-4 h-4" />
              <span>{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="FileType" className="w-4 h-4" />
              <span className="uppercase">{file.format}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>{formatDate(file.uploadDate)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          {(file.status === "processing" || file.status === "completed") && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Estimated Time */}
          {file.status === "processing" && (
            <p className="text-sm text-gray-600">
              Estimated time remaining: {Math.max(1, Math.round((100 - progress) / 10))} minutes
            </p>
          )}

          {/* Error Message */}
          {file.status === "failed" && (
            <p className="text-sm text-error">
              Transcription failed. Please try again or check your API configuration.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {file.status === "failed" && (
            <Button
              onClick={onRetry}
              variant="primary"
              size="sm"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
              Retry
            </Button>
          )}
          
          {(file.status === "queued" || file.status === "failed") && (
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}

          {file.status === "completed" && (
            <Button
              onClick={() => window.location.href = `/transcript/${file.Id}`}
              variant="primary"
              size="sm"
            >
              <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProcessingQueuePage