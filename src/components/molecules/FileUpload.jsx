import { useState, useRef } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const FileUpload = ({ onUpload, accept = ".mp3,.wav,.m4a", multiple = true, className }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const extension = "." + file.name.split(".").pop().toLowerCase()
      return accept.includes(extension)
    })
    if (validFiles.length > 0) {
      onUpload?.(validFiles)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onUpload?.(files)
    }
    e.target.value = ""
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "drop-zone rounded-lg p-8 text-center transition-all duration-300",
          "border-2 border-dashed border-gray-300 bg-gray-50",
          isDragOver && "drag-over border-primary bg-primary/5"
        )}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your audio files here
            </h3>
            <p className="text-gray-600 mb-4">
              Supports MP3, WAV, and M4A formats
            </p>
            <Button onClick={openFileDialog} variant="primary">
              <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default FileUpload