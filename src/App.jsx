import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import FilesPage from "@/components/pages/FilesPage"
import FoldersPage from "@/components/pages/FoldersPage"
import ProcessingQueuePage from "@/components/pages/ProcessingQueuePage"
import TranscriptPage from "@/components/pages/TranscriptPage"
import SearchPage from "@/components/pages/SearchPage"
import SettingsPage from "@/components/pages/SettingsPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/files" replace />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/folders" element={<FoldersPage />} />
            <Route path="/processing" element={<ProcessingQueuePage />} />
            <Route path="/transcript/:id" element={<TranscriptPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App