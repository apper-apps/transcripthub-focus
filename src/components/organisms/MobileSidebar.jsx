import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Files", href: "/files", icon: "FileAudio" },
    { name: "Folders", href: "/folders", icon: "FolderOpen" },
    { name: "Processing", href: "/processing", icon: "Clock" },
    { name: "Search", href: "/search", icon: "Search" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-64 h-full bg-surface border-r border-gray-200 z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Headphones" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TranscriptHub</h1>
                  <p className="text-sm text-gray-500">Audio Transcription</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar