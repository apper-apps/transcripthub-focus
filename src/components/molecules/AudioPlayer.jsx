import { useState, useRef, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { formatDuration } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const AudioPlayer = ({ 
  src, 
  className, 
  onTimeUpdate, 
  currentTime: externalCurrentTime,
  onSeek 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    if (externalCurrentTime !== undefined && audioRef.current) {
      audioRef.current.currentTime = externalCurrentTime
      setCurrentTime(externalCurrentTime)
    }
  }, [externalCurrentTime])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
      onSeek?.(newTime)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("bg-surface border-t border-gray-200 p-4", className)}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          variant="primary"
          size="lg"
          className="rounded-full w-12 h-12 p-0"
        >
          <ApperIcon 
            name={isPlaying ? "Pause" : "Play"} 
            className="w-5 h-5" 
          />
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600 min-w-[40px]">
            {formatDuration(currentTime)}
          </span>
          
          <div 
            className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg transition-all duration-150"
              style={{ left: `${progress}%` }}
            />
          </div>
          
          <span className="text-sm font-medium text-gray-600 min-w-[40px]">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center space-x-1">
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handlePlaybackRateChange(rate)}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                playbackRate === rate
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <ApperIcon name="Volume2" className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #5B47E0 0%, #5B47E0 ${volume * 100}%, #E5E7EB ${volume * 100}%, #E5E7EB 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer