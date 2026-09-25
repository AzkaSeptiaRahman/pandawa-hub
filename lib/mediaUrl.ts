const API = process.env.NEXT_PUBLIC_API_URL;

// Nilai media dari API bisa berupa:
// - URL absolut (S3 / CDN)  -> dipakai apa adanya
// - path relatif lama       -> digabung dengan base API
export function mediaUrl(url?: string | null) {
  if (!url) return "";

  return url.startsWith("http") ? url : `${API}${url}`;
}
