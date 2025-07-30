import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { transcriptService } from "@/services/api/transcriptService"
import { audioFileService } from "@/services/api/audioFileService"
import { folderService } from "@/services/api/folderService"
import { formatDate } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    speaker: "",
    folder: "",
    dateRange: "all"
  })
  const [transcripts, setTranscripts] = useState([])
  const [audioFiles, setAudioFiles] = useState([])
  const [folders, setFolders] = useState([])

  const loadData = async () => {
    try {
      const [transcriptsData, filesData, foldersData] = await Promise.all([
        transcriptService.getAll(),
        audioFileService.getAll(),
        folderService.getAll()
      ])
      setTranscripts(transcriptsData)
      setAudioFiles(filesData)
      setFolders(foldersData)
    } catch (err) {
      console.error("Error loading data:", err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const queryParam = searchParams.get("q")
    if (queryParam) {
      setQuery(queryParam)
      performSearch(queryParam)
    }
  }, [searchParams])

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Search through transcripts
      const searchResults = []
      const lowercaseQuery = searchQuery.toLowerCase()

      for (const transcript of transcripts) {
        const audioFile = audioFiles.find(f => f.Id === transcript.audioFileId)
        if (!audioFile) continue

        // Search in transcript content
        const matches = []
        
        for (const speaker of transcript.speakers || []) {
          for (const segment of speaker.segments || []) {
            if (segment.text.toLowerCase().includes(lowercaseQuery)) {
              matches.push({
                speakerName: speaker.name,
                text: segment.text,
                startTime: segment.startTime,
                endTime: segment.endTime
              })
            }
          }
        }

        // Search in file name
        if (audioFile.name.toLowerCase().includes(lowercaseQuery)) {
          matches.push({
            speakerName: "File Name",
            text: audioFile.name,
            startTime: 0,
            endTime: 0,
            isFileName: true
          })
        }

        if (matches.length > 0) {
          const folder = audioFile.folderId ? 
            folders.find(f => f.Id === audioFile.folderId) : null

          searchResults.push({
            transcript,
            audioFile,
            folder,
            matches: matches.slice(0, 5) // Limit matches per file
          })
        }
      }

      // Apply filters
      let filteredResults = searchResults

      if (filters.speaker) {
        filteredResults = filteredResults.filter(result =>
          result.matches.some(match => 
            match.speakerName.toLowerCase().includes(filters.speaker.toLowerCase())
          )
        )
      }

      if (filters.folder) {
        filteredResults = filteredResults.filter(result =>
          result.folder?.name.toLowerCase().includes(filters.folder.toLowerCase())
        )
      }

      if (filters.dateRange !== "all") {
        const now = new Date()
        const cutoffDate = new Date()
        
        switch (filters.dateRange) {
          case "today":
            cutoffDate.setHours(0, 0, 0, 0)
            break
          case "week":
            cutoffDate.setDate(now.getDate() - 7)
            break
          case "month":
            cutoffDate.setMonth(now.getMonth() - 1)
            break
        }

        filteredResults = filteredResults.filter(result =>
          new Date(result.audioFile.uploadDate) >= cutoffDate
        )
      }

      setResults(filteredResults)
    } catch (err) {
      setError("Search failed. Please try again.")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newQuery) => {
    setQuery(newQuery)
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery })
    } else {
      setSearchParams({})
      setResults([])
    }
  }

  const highlightText = (text, query) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    )
  }

  const handleResultClick = (result) => {
    navigate(`/transcript/${result.audioFile.Id}`)
  }

  const uniqueSpeakers = [
    ...new Set(
      transcripts.flatMap(t => 
        t.speakers?.map(s => s.name) || []
      )
    )
  ].filter(Boolean)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Transcripts</h1>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search through all your transcripts..."
          className="max-w-2xl"
        />
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Filter" className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.speaker}
            onChange={(e) => setFilters(prev => ({ ...prev, speaker: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Speakers</option>
            {uniqueSpeakers.map(speaker => (
              <option key={speaker} value={speaker}>{speaker}</option>
            ))}
          </select>

          <select
            value={filters.folder}
            onChange={(e) => setFilters(prev => ({ ...prev, folder: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Folders</option>
            {folders.map(folder => (
              <option key={folder.Id} value={folder.name}>{folder.name}</option>
            ))}
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>

          {(filters.speaker || filters.folder || filters.dateRange !== "all") && (
            <button
              onClick={() => setFilters({ speaker: "", folder: "", dateRange: "all" })}
              className="text-sm text-primary hover:text-secondary transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {loading ? (
        <Loading message="Searching transcripts..." />
      ) : error ? (
        <Error message={error} onRetry={() => performSearch(query)} />
      ) : !query.trim() ? (
        <Empty
          title="Start searching"
          description="Enter keywords in the search bar above to find content in your transcripts"
          icon="Search"
        />
      ) : results.length === 0 ? (
        <Empty
          title="No results found"
          description={`No transcripts contain "${query}". Try different keywords or check your spelling.`}
          icon="SearchX"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {results.length} result(s) for "{query}"
            </p>
          </div>

          {results.map((result, index) => (
            <SearchResultCard
              key={`${result.audioFile.Id}-${index}`}
              result={result}
              query={query}
              onResultClick={() => handleResultClick(result)}
              highlightText={highlightText}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const SearchResultCard = ({ result, query, onResultClick, highlightText }) => {
  const { audioFile, folder, matches } = result

  return (
    <Card hover className="p-6 cursor-pointer" onClick={onResultClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {highlightText(audioFile.name, query)}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              {folder && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Folder" className="w-4 h-4" />
                  <span>{folder.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>{formatDate(audioFile.uploadDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <Badge variant="primary">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="space-y-3">
        {matches.map((match, matchIndex) => (
          <div
            key={matchIndex}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <Badge variant="secondary" size="sm">
                {match.isFileName ? "File" : match.speakerName}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 leading-relaxed">
                {highlightText(match.text, query)}
              </p>
              {!match.isFileName && match.startTime > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  At {Math.floor(match.startTime / 60)}:{(match.startTime % 60).toString().padStart(2, "0")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SearchPage