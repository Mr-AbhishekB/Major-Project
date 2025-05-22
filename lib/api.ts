// Create a new file to centralize API configuration

export const API_BASE_URL = "http://localhost:5000";

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // This sends cookies with the request if needed
  });
  
  return response;
}
