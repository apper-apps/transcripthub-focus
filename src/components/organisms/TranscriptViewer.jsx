import { useState, useEffect, useRef } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import AudioPlayer from "@/components/molecules/AudioPlayer"
import { formatTimestamp, getSpeakerColors } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const TranscriptViewer = ({ transcript, audioFile, onSpeakerNameChange, onExport }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [activeSpeaker, setActiveSpeaker] = useState(null)
  const [editingSpeaker, setEditingSpeaker] = useState(null)
  const [newSpeakerName, setNewSpeakerName] = useState("")
  const segmentRefs = useRef({})
  const colors = getSpeakerColors()

  useEffect(() => {
    // Find active speaker based on current time
    const activeSegment = transcript?.speakers
      ?.flatMap(speaker => speaker.segments.map(segment => ({ ...segment, speakerId: speaker.id })))
      ?.find(segment => currentTime >= segment.startTime && currentTime <= segment.endTime)
    
    setActiveSpeaker(activeSegment?.speakerId || null)

    // Scroll to active segment
    if (activeSegment && segmentRefs.current[`${activeSegment.speakerId}-${activeSegment.startTime}`]) {
      segmentRefs.current[`${activeSegment.speakerId}-${activeSegment.startTime}`].scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }, [currentTime, transcript])

  const handleSpeakerNameEdit = (speakerId, currentName) => {
    setEditingSpeaker(speakerId)
    setNewSpeakerName(currentName)
  }

  const saveSpeakerName = (speakerId) => {
    if (newSpeakerName.trim()) {
      onSpeakerNameChange?.(speakerId, newSpeakerName.trim())
    }
    setEditingSpeaker(null)
    setNewSpeakerName("")
  }

  const handleSegmentClick = (startTime) => {
    setCurrentTime(startTime)
  }

  const exportOptions = [
    { format: "txt", label: "Text File", icon: "FileText" },
    { format: "pdf", label: "PDF Document", icon: "FileDown" },
    { format: "docx", label: "Word Document", icon: "FileText" }
  ]

  if (!transcript) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="FileText" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No transcript available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{audioFile?.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span>{transcript.speakers?.length || 0} speakers</span>
              <Badge variant="success">
                <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex items-center space-x-2">
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              onClick={() => onExport?.(option.format)}
              variant="outline"
              size="sm"
            >
              <ApperIcon name={option.icon} className="w-4 h-4 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Speaker List */}
        <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Speakers</h3>
          <div className="space-y-3">
            {transcript.speakers?.map((speaker, index) => (
              <Card key={speaker.id} className="p-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    {editingSpeaker === speaker.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newSpeakerName}
                          onChange={(e) => setNewSpeakerName(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveSpeakerName(speaker.id)
                            if (e.key === "Escape") {
                              setEditingSpeaker(null)
                              setNewSpeakerName("")
                            }
                          }}
                        />
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => saveSpeakerName(speaker.id)}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingSpeaker(null)
                              setNewSpeakerName("")
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
                      <div
                        className="cursor-pointer"
                        onClick={() => handleSpeakerNameEdit(speaker.id, speaker.name)}
                      >
                        <p className="font-medium text-gray-900 truncate">
                          {speaker.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {speaker.segments?.length || 0} segments
                        </p>
                      </div>
                    )}
                  </div>
                  {editingSpeaker !== speaker.id && (
                    <button
                      onClick={() => handleSpeakerNameEdit(speaker.id, speaker.name)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ApperIcon name="Edit2" className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transcript Text */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {transcript.speakers?.map((speaker, speakerIndex) => 
              speaker.segments?.map((segment, segmentIndex) => (
                <div
                  key={`${speaker.id}-${segment.startTime}`}
                  ref={(el) => segmentRefs.current[`${speaker.id}-${segment.startTime}`] = el}
                  className={cn(
                    "flex space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200",
                    activeSpeaker === speaker.id && currentTime >= segment.startTime && currentTime <= segment.endTime
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleSegmentClick(segment.startTime)}
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[speakerIndex % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {speaker.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(segment.startTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">
                      {segment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {audioFile && (
        <AudioPlayer
          src={`/api/audio/${audioFile.Id}`}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          onSeek={setCurrentTime}
          className="border-t border-gray-200"
        />
      )}
    </div>
  )
}

export default TranscriptViewer