import { NextResponse } from "next/server"
import { getSessionFromCookies } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getSessionFromCookies()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "You must be signed in to access this endpoint" }), { status: 401 })
  }

  try {
    const { trackId, trackName, artistName } = await request.json()

    if (!trackId || !trackName || !artistName) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
    }

    // For demo purposes, just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving track history:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to save track history" }), { status: 500 })
  }
}
