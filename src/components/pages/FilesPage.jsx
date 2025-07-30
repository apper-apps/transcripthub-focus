import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FileUpload from "@/components/molecules/FileUpload"
import FileList from "@/components/organisms/FileList"
import FolderTree from "@/components/molecules/FolderTree"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { audioFileService } from "@/services/api/audioFileService"
import { folderService } from "@/services/api/folderService"

const FilesPage = () => {
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [showUpload, setShowUpload] = useState(false)
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [filesData, foldersData] = await Promise.all([
        audioFileService.getAll(),
        folderService.getAll()
      ])
      setFiles(filesData)
      setFolders(foldersData)
    } catch (err) {
      setError("Failed to load files. Please try again.")
      console.error("Error loading files:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleFileUpload = async (uploadedFiles) => {
    try {
      const newFiles = await Promise.all(
        uploadedFiles.map(file => audioFileService.create({
          name: file.name,
          originalName: file.name,
          size: file.size,
          duration: 0, // Would be calculated after upload
          format: file.name.split(".").pop().toLowerCase(),
          uploadDate: new Date().toISOString(),
          status: "queued",
          folderId: selectedFolder
        }))
      )
      
      setFiles(prev => [...prev, ...newFiles])
      setShowUpload(false)
      toast.success(`Successfully uploaded ${newFiles.length} file(s)`)
    } catch (err) {
      toast.error("Failed to upload files")
      console.error("Upload error:", err)
    }
  }

  const handleFileSelect = (file) => {
    if (file.status === "completed") {
      navigate(`/transcript/${file.Id}`)
    } else {
      toast.info(`File is ${file.status}. Transcript not available yet.`)
    }
  }

  const handleFileDelete = async (fileId) => {
    try {
      await audioFileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.Id !== fileId))
      toast.success("File deleted successfully")
    } catch (err) {
      toast.error("Failed to delete file")
      console.error("Delete error:", err)
    }
  }

  const handleCreateFolder = async (folderData) => {
    try {
      const newFolder = await folderService.create(folderData)
      setFolders(prev => [...prev, newFolder])
      toast.success("Folder created successfully")
    } catch (err) {
      toast.error("Failed to create folder")
      console.error("Create folder error:", err)
    }
  }

  const handleDeleteFolder = async (folderId) => {
    try {
      await folderService.delete(folderId)
      setFolders(prev => prev.filter(f => f.Id !== folderId))
      if (selectedFolder === folderId) {
        setSelectedFolder(null)
      }
      toast.success("Folder deleted successfully")
    } catch (err) {
      toast.error("Failed to delete folder")
      console.error("Delete folder error:", err)
    }
  }

  const filteredFiles = selectedFolder 
    ? files.filter(file => file.folderId === selectedFolder)
    : files

  if (loading) {
    return <Loading message="Loading audio files..." showWaveform />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-gray-200 p-6 overflow-y-auto">
        <FolderTree
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
        />

        {/* Quick Stats */}
        <Card className="mt-6 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Files:</span>
              <span className="font-medium">{files.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-success">
                {files.filter(f => f.status === "completed").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing:</span>
              <span className="font-medium text-warning">
                {files.filter(f => f.status === "processing").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failed:</span>
              <span className="font-medium text-error">
                {files.filter(f => f.status === "failed").length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedFolder ? folders.find(f => f.Id === selectedFolder)?.name : "All Files"}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredFiles.length} file(s) in this {selectedFolder ? "folder" : "library"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <ApperIcon name="Grid3x3" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => setShowUpload(!showUpload)}
              variant="primary"
            >
              <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="mb-6">
            <FileUpload onUpload={handleFileUpload} />
          </div>
        )}

        {/* File List */}
        {filteredFiles.length === 0 ? (
          <Empty
            title="No audio files found"
            description={selectedFolder 
              ? "This folder is empty. Upload some audio files to get started."
              : "Upload your first audio file to begin transcription."
            }
            action={() => setShowUpload(true)}
            actionText="Upload Files"
            icon="FileAudio"
          />
        ) : (
          <FileList
            files={filteredFiles}
            onFileSelect={handleFileSelect}
            onFileDelete={handleFileDelete}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  )
}

export default FilesPage