export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL (e.g., from Cloudinary, S3, or Supabase), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Get the base API URL
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    "https://pos-backend-qcky.onrender.com/api";
  // const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api";

  // Remove trailing '/api' to get the base domain for static assets if hosted on the same server
  const baseUrl = apiUrl.endsWith("/api")
    ? apiUrl.substring(0, apiUrl.length - 4)
    : apiUrl;

  // Combine base URL with the image path
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  // Default assumption: backend serves static files from the root or /uploads directory
  // Example: if imagePath is "uploads/pic.jpg", it returns "https://domain.com/uploads/pic.jpg"
  return `${baseUrl}${normalizedPath}`;
};
