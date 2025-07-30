import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import { useNavigate } from "react-router-dom"

const Header = ({ onMenuClick, currentPath }) => {
  const navigate = useNavigate()

  const getPageTitle = (path) => {
    switch (path) {
      case "/files":
        return "Audio Files"
      case "/folders":
        return "Folder Management"
      case "/processing":
        return "Processing Queue"
      case "/search":
        return "Search Transcripts"
      case "/settings":
        return "Settings"
      default:
        if (path.startsWith("/transcript/")) {
          return "Transcript Viewer"
        }
        return "TranscriptHub"
    }
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <header className="bg-surface border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page Title */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle(currentPath)}
            </h1>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:block w-80">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search transcripts..."
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigate("/processing")}
              variant="ghost"
              size="sm"
              className="relative"
            >
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Queue</span>
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              variant="ghost"
              size="sm"
            >
              <ApperIcon name="Settings" className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search transcripts..."
        />
      </div>
    </header>
  )
}

export default Header