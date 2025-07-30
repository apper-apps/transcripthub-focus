import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import { formatFileSize, formatDuration, formatDate, getStatusColor } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const FileList = ({ files, onFileSelect, onFileDelete, viewMode = "grid" }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set())

  const toggleFileSelection = (fileId) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
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

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card
          key={file.Id}
          hover
          className="p-4 cursor-pointer"
          onClick={() => onFileSelect?.(file)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                file.status === "processing" ? "processing-pulse" : "bg-gradient-to-br from-primary to-secondary"
              )}>
                <ApperIcon 
                  name={getStatusIcon(file.status)} 
                  className="w-5 h-5 text-white" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <Badge variant={getStatusColor(file.status).includes("success") ? "success" : 
                               getStatusColor(file.status).includes("warning") ? "warning" :
                               getStatusColor(file.status).includes("error") ? "error" : "info"}>
                  {file.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFileSelection(file.Id)
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ApperIcon 
                  name={selectedFiles.has(file.Id) ? "CheckSquare" : "Square"} 
                  className="w-4 h-4" 
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileDelete?.(file.Id)
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="font-medium text-gray-900 mb-2 truncate" title={file.name}>
            {file.name}
          </h3>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Duration:</span>
              <span>{formatDuration(file.duration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Size:</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Format:</span>
              <span className="uppercase">{file.format}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {formatDate(file.uploadDate)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="bg-surface rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr
                key={file.Id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onFileSelect?.(file)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                      file.status === "processing" ? "processing-pulse" : "bg-gradient-to-br from-primary to-secondary"
                    )}>
                      <ApperIcon 
                        name={getStatusIcon(file.status)} 
                        className="w-4 h-4 text-white" 
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-500 uppercase">
                        {file.format}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(file.status).includes("success") ? "success" : 
                                 getStatusColor(file.status).includes("warning") ? "warning" :
                                 getStatusColor(file.status).includes("error") ? "error" : "info"}>
                    {file.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(file.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(file.uploadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFileSelection(file.Id)
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ApperIcon 
                        name={selectedFiles.has(file.Id) ? "CheckSquare" : "Square"} 
                        className="w-4 h-4" 
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileDelete?.(file.Id)
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {viewMode === "grid" ? renderGridView() : renderListView()}
      
      {selectedFiles.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-surface border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-900">
              {selectedFiles.size} files selected
            </span>
            <Button
              onClick={() => setSelectedFiles(new Set())}
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                selectedFiles.forEach(fileId => onFileDelete?.(fileId))
                setSelectedFiles(new Set())
              }}
              variant="error"
              size="sm"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileList