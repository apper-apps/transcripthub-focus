import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const FolderTree = ({ folders, selectedFolder, onFolderSelect, onCreateFolder, onDeleteFolder }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [parentFolderId, setParentFolderId] = useState(null)

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder?.({
        name: newFolderName.trim(),
        parentId: parentFolderId
      })
      setNewFolderName("")
      setShowCreateForm(false)
      setParentFolderId(null)
    }
  }

  const startCreateFolder = (parentId = null) => {
    setParentFolderId(parentId)
    setShowCreateForm(true)
  }

  const renderFolder = (folder, level = 0) => {
    const hasChildren = folders.some(f => f.parentId === folder.Id)
    const isExpanded = expandedFolders.has(folder.Id)
    const isSelected = selectedFolder === folder.Id

    return (
      <div key={folder.Id} className="select-none">
        <div
          className={cn(
            "flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group",
            "hover:bg-gray-100",
            isSelected && "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium",
            level > 0 && "ml-6"
          )}
          onClick={() => onFolderSelect?.(folder.Id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.Id)
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              <ApperIcon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                className="w-4 h-4" 
              />
            </button>
          )}
          
          <ApperIcon 
            name={isExpanded && hasChildren ? "FolderOpen" : "Folder"} 
            className="w-4 h-4 mr-2" 
          />
          
          <span className="flex-1 truncate">{folder.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                startCreateFolder(folder.Id)
              }}
              className="p-1 hover:bg-gray-200 rounded"
              title="Create subfolder"
            >
              <ApperIcon name="Plus" className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteFolder?.(folder.Id)
              }}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
              title="Delete folder"
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {folders
              .filter(f => f.parentId === folder.Id)
              .map(childFolder => renderFolder(childFolder, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const rootFolders = folders.filter(f => !f.parentId)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Folders</h3>
        <Button
          onClick={() => startCreateFolder()}
          variant="ghost"
          size="sm"
          className="p-1 h-auto"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
        </Button>
      </div>

      {/* All Files Option */}
      <div
        onClick={() => onFolderSelect?.(null)}
        className={cn(
          "flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-gray-100",
          selectedFolder === null && "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium"
        )}
      >
        <ApperIcon name="Files" className="w-4 h-4 mr-2" />
        <span>All Files</span>
      </div>

      {/* Folder Tree */}
      {rootFolders.map(folder => renderFolder(folder))}

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder()
              if (e.key === "Escape") {
                setShowCreateForm(false)
                setNewFolderName("")
              }
            }}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleCreateFolder}
              variant="primary"
              size="sm"
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
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FolderTree