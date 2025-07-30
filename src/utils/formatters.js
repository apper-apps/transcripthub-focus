export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
};

export const formatTimestamp = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "text-success bg-success/10";
    case "processing":
      return "text-warning bg-warning/10";
    case "failed":
      return "text-error bg-error/10";
    case "queued":
      return "text-info bg-info/10";
    default:
      return "text-gray-500 bg-gray-100";
  }
};

export const getSpeakerColors = () => [
  "#5B47E0", // Primary Purple
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#84CC16", // Lime
];