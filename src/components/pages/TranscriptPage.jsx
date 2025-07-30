import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import TranscriptViewer from "@/components/organisms/TranscriptViewer"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { audioFileService } from "@/services/api/audioFileService"
import { transcriptService } from "@/services/api/transcriptService"

const TranscriptPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [audioFile, setAudioFile] = useState(null)
  const [transcript, setTranscript] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const file = await audioFileService.getById(parseInt(id))
      if (!file) {
        throw new Error("Audio file not found")
      }
      
      setAudioFile(file)

      if (file.status === "completed") {
        // Find transcript for this audio file
        const transcripts = await transcriptService.getAll()
        const fileTranscript = transcripts.find(t => t.audioFileId === file.Id)
        if (fileTranscript) {
          setTranscript(fileTranscript)
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load transcript. Please try again.")
      console.error("Error loading transcript:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const handleSpeakerNameChange = async (speakerId, newName) => {
    try {
      if (!transcript) return
      
      const updatedTranscript = {
        ...transcript,
        speakers: transcript.speakers.map(speaker =>
          speaker.id === speakerId ? { ...speaker, name: newName } : speaker
        )
      }
      
      await transcriptService.update(transcript.Id, updatedTranscript)
      setTranscript(updatedTranscript)
      toast.success("Speaker name updated")
    } catch (err) {
      toast.error("Failed to update speaker name")
      console.error("Update speaker error:", err)
    }
  }

  const handleExport = async (format) => {
    try {
      if (!transcript) return

      // Generate export content based on format
      let content = ""
      let filename = `${audioFile.name}_transcript.${format}`

      if (format === "txt") {
        content = transcript.speakers
          ?.flatMap(speaker => 
            speaker.segments?.map(segment => 
              `[${speaker.name}] ${segment.text}`
            ) || []
          )
          .join("\n\n") || ""
      } else if (format === "pdf" || format === "docx") {
        // For demo purposes, we'll create a simple text version
        content = `Transcript: ${audioFile.name}\n\n`
        content += transcript.speakers
          ?.flatMap(speaker => 
            speaker.segments?.map(segment => 
              `[${segment.startTime}s] ${speaker.name}: ${segment.text}`
            ) || []
          )
          .join("\n\n") || ""
      }

      // Create and download file
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Transcript exported as ${format.toUpperCase()}`)
    } catch (err) {
      toast.error("Failed to export transcript")
      console.error("Export error:", err)
    }
  }

  if (loading) {
    return <Loading message="Loading transcript..." showWaveform />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadData}
        showRetry={!error.includes("not found")}
      />
    )
  }

  if (!audioFile) {
    return (
      <Error 
        message="Audio file not found" 
        showRetry={false}
        icon="FileX"
      />
    )
  }

  if (audioFile.status !== "completed") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-warning to-orange-600 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="Clock" className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Transcript Not Ready
        </h2>
        
        <p className="text-gray-600 text-center mb-6 max-w-md">
          This audio file is currently being processed. The transcript will be available once processing is complete.
        </p>

        <div className="flex items-center space-x-3 mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>Status: {audioFile.status}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={() => navigate("/processing")}
            variant="primary"
          >
            <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
            View Processing Queue
          </Button>
          
          <Button
            onClick={() => navigate("/files")}
            variant="outline"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Files
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Back Navigation */}
      <div className="px-6 py-4 border-b border-gray-200 bg-surface">
        <Button
          onClick={() => navigate("/files")}
          variant="ghost"
          size="sm"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Files
        </Button>
      </div>

      {/* Transcript Viewer */}
      <div className="flex-1 overflow-hidden">
        <TranscriptViewer
          transcript={transcript}
          audioFile={audioFile}
          onSpeakerNameChange={handleSpeakerNameChange}
          onExport={handleExport}
        />
      </div>
    </div>
  )
}

export default TranscriptPage