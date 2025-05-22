import { NextResponse } from "next/server"
import { getSessionFromCookies } from "@/lib/auth"

export async function GET() {
  const session = getSessionFromCookies()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "You must be signed in to access this endpoint" }), { status: 401 })
  }

  try {
    // For demo purposes, return mock data
    return NextResponse.json({
      item: {
        id: "spotify:track:123456",
        name: "Shape of You",
        artists: [{ name: "Ed Sheeran" }],
        album: {
          name: "÷ (Divide)",
          images: [{ url: "/placeholder.svg?height=300&width=300" }],
        },
        external_urls: {
          spotify: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching currently playing track:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch currently playing track" }), { status: 500 })
  }
}
