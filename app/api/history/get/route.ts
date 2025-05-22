import { NextResponse } from "next/server"
import { getSessionFromCookies } from "@/lib/auth"

export async function GET() {
  const session = getSessionFromCookies()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "You must be signed in to access this endpoint" }), { status: 401 })
  }

  try {
    // For demo purposes, return mock data
    const mockHistory = [
      {
        id: "1",
        track_name: "Shape of You",
        artist_name: "Ed Sheeran",
        mood: "positive",
        score: 0.85,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        track_name: "Someone Like You",
        artist_name: "Adele",
        mood: "negative",
        score: 0.75,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        track_name: "Uptown Funk",
        artist_name: "Mark Ronson ft. Bruno Mars",
        mood: "positive",
        score: 0.92,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    return NextResponse.json(mockHistory)
  } catch (error) {
    console.error("Error fetching mood history:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch mood history" }), { status: 500 })
  }
}
