import { useState } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import MobileSidebar from "@/components/organisms/MobileSidebar"

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={toggleMobileSidebar}
            currentPath={location.pathname}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </div>
  )
}

export default Layout