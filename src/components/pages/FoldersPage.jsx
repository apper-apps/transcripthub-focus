import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { folderService } from "@/services/api/folderService"
import { audioFileService } from "@/services/api/audioFileService"
import { formatDate } from "@/utils/formatters"

const FoldersPage = () => {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [foldersData, filesData] = await Promise.all([
        folderService.getAll(),
        audioFileService.getAll()
      ])
      setFolders(foldersData)
      setFiles(filesData)
    } catch (err) {
      setError("Failed to load folders. Please try again.")
      console.error("Error loading folders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const newFolder = await folderService.create({
        name: newFolderName.trim(),
        parentId: null
      })
      setFolders(prev => [...prev, newFolder])
      setNewFolderName("")
      setShowCreateForm(false)
      toast.success("Folder created successfully")
    } catch (err) {
      toast.error("Failed to create folder")
      console.error("Create folder error:", err)
    }
  }

  const handleDeleteFolder = async (folderId) => {
    const folderFiles = files.filter(f => f.folderId === folderId)
    if (folderFiles.length > 0) {
      toast.error("Cannot delete folder that contains files")
      return
    }

    try {
      await folderService.delete(folderId)
      setFolders(prev => prev.filter(f => f.Id !== folderId))
      toast.success("Folder deleted successfully")
    } catch (err) {
      toast.error("Failed to delete folder")
      console.error("Delete folder error:", err)
    }
  }

  const handleRenameFolder = async (folderId, newName) => {
    if (!newName.trim()) return

    try {
      const updatedFolder = await folderService.update(folderId, { name: newName.trim() })
      setFolders(prev => prev.map(f => f.Id === folderId ? updatedFolder : f))
      toast.success("Folder renamed successfully")
    } catch (err) {
      toast.error("Failed to rename folder")
      console.error("Rename folder error:", err)
    }
  }

  const getFolderStats = (folderId) => {
    const folderFiles = files.filter(f => f.folderId === folderId)
    return {
      total: folderFiles.length,
      completed: folderFiles.filter(f => f.status === "completed").length,
      processing: folderFiles.filter(f => f.status === "processing").length,
      failed: folderFiles.filter(f => f.status === "failed").length
    }
  }

  if (loading) {
    return <Loading message="Loading folders..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Folder Management</h1>
          <p className="text-gray-600 mt-2">
            Organize your audio files and transcripts into folders
          </p>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Folder
        </Button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder()
                  if (e.key === "Escape") {
                    setShowCreateForm(false)
                    setNewFolderName("")
                  }
                }}
                autoFocus
              />
            </div>
            <Button
              onClick={handleCreateFolder}
              variant="primary"
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setShowCreateForm(false)
                setNewFolderName("")
              }}
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <Empty
          title="No folders created yet"
          description="Create your first folder to organize your audio files and transcripts"
          action={() => setShowCreateForm(true)}
          actionText="Create Folder"
          icon="FolderPlus"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folders.map((folder) => {
            const stats = getFolderStats(folder.Id)
            return (
              <FolderCard
                key={folder.Id}
                folder={folder}
                stats={stats}
                onDelete={() => handleDeleteFolder(folder.Id)}
                onRename={(newName) => handleRenameFolder(folder.Id, newName)}
                onSelect={() => setSelectedFolder(folder)}
              />
            )
          })}
        </div>
      )}

      {/* Folder Details Modal */}
      {selectedFolder && (
        <FolderDetailsModal
          folder={selectedFolder}
          files={files.filter(f => f.folderId === selectedFolder.Id)}
          onClose={() => setSelectedFolder(null)}
        />
      )}
    </div>
  )
}

const FolderCard = ({ folder, stats, onDelete, onRename, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(folder.name)

  const handleSave = () => {
    if (editName.trim() !== folder.name) {
      onRename(editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <Card hover className="p-6 cursor-pointer" onClick={onSelect}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="Folder" className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Rename folder"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
            title="Delete folder"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") {
                setIsEditing(false)
                setEditName(folder.name)
              }
            }}
            autoFocus
          />
          <div className="flex space-x-2">
            <Button onClick={handleSave} variant="primary" size="sm" className="flex-1">
              Save
            </Button>
            <Button 
              onClick={() => {
                setIsEditing(false)
                setEditName(folder.name)
              }} 
              variant="ghost" 
              size="sm" 
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-gray-900 mb-2 truncate" title={folder.name}>
            {folder.name}
          </h3>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-between">
              <span>Total Files:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed:</span>
              <span className="font-medium text-success">{stats.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing:</span>
              <span className="font-medium text-warning">{stats.processing}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Created {formatDate(folder.createdAt)}
            </p>
          </div>
        </>
      )}
    </Card>
  )
}

const FolderDetailsModal = ({ folder, files, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Folder" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{folder.name}</h2>
              <p className="text-sm text-gray-600">{files.length} files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {files.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FileX" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">This folder is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileAudio" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {file.format.toUpperCase()} • {formatDate(file.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      file.status === "completed" ? "bg-success/10 text-success" :
                      file.status === "processing" ? "bg-warning/10 text-warning" :
                      file.status === "failed" ? "bg-error/10 text-error" :
                      "bg-info/10 text-info"
                    }`}>
                      {file.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoldersPage