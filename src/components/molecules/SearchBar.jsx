import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ onSearch, placeholder = "Search transcripts...", className }) => {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch?.("")
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon name="X" className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  )
}

export default SearchBar