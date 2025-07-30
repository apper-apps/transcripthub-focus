import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = () => {
  const navigation = [
    { name: "Files", href: "/files", icon: "FileAudio" },
    { name: "Folders", href: "/folders", icon: "FolderOpen" },
    { name: "Processing", href: "/processing", icon: "Clock" },
    { name: "Search", href: "/search", icon: "Search" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  return (
    <div className="w-64 bg-surface border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Headphones" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TranscriptHub</h1>
            <p className="text-sm text-gray-500">Audio Transcription</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                "hover:bg-gray-100 hover:text-gray-900",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                  : "text-gray-600"
              )
            }
          >
            <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Version 1.0.0</span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Zap" className="w-3 h-3" />
            <span>ElevenLabs API</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar