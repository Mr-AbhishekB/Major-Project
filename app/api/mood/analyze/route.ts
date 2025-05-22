import { NextResponse } from "next/server"
import { getSessionFromCookies } from "@/lib/auth"

// This would normally use your ML model, but we'll simulate it for now
function analyzeMood(trackInfo: any) {
  // For demonstration, we'll generate a random mood
  const moods = ["positive", "neutral", "negative"]
  const randomIndex = Math.floor(Math.random() * moods.length)
  const mood = moods[randomIndex]

  // Generate a random score between 0.5 and 1.0
  const score = 0.5 + Math.random() * 0.5

  // Generate a random confidence between 0.7 and 1.0
  const confidence = 0.7 + Math.random() * 0.3

  return {
    mood,
    score,
    confidence,
    artist: trackInfo?.artists[0]?.name || "Unknown Artist",
  }
}

export async function GET() {
  const session = await getSessionFromCookies()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "You must be signed in to access this endpoint" }), { status: 401 })
  }

  try {
    // For demo purposes, use mock data
    const mockTrack = {
      id: "spotify:track:123456",
      name: "Shape of You",
      artists: [{ name: "Ed Sheeran" }],
    }

    // Analyze the mood based on the track
    const moodData = analyzeMood(mockTrack)

    return NextResponse.json(moodData)
  } catch (error) {
    console.error("Error analyzing mood:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to analyze mood" }), { status: 500 })
  }
}
