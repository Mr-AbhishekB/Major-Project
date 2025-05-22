"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Music } from "lucide-react"

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  external_urls: {
    spotify: string
  }
}

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCurrentlyPlaying = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/spotify/currently-playing")

      if (!response.ok) {
        if (response.status === 204) {
          setTrack(null)
          setError("No track currently playing")
          return
        }
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setTrack(data.item)

      // Save track to history
      if (data.item) {
        await fetch("/api/history/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trackId: data.item.id,
            trackName: data.item.name,
            artistName: data.item.artists[0].name,
          }),
        })
      }
    } catch (err) {
      console.error("Failed to fetch currently playing track:", err)
      setError("Failed to fetch currently playing track")
      toast({
        title: "Error",
        description: "Failed to fetch currently playing track",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentlyPlaying()

    // Refresh every 30 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Currently Playing</CardTitle>
            <CardDescription>Your current Spotify track</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchCurrentlyPlaying} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Start playing a song on Spotify to analyze your mood</p>
          </div>
        ) : track ? (
          <div className="flex items-center space-x-4">
            <img
              src={track.album.images[0]?.url || "/placeholder.svg?height=64&width=64"}
              alt={track.album.name}
              className="h-16 w-16 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium">{track.name}</h3>
              <p className="text-sm text-muted-foreground">{track.artists.map((artist) => artist.name).join(", ")}</p>
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-500 hover:underline mt-1 inline-block"
              >
                Open in Spotify
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No track currently playing</p>
            <p className="text-sm text-muted-foreground mt-2">Start playing a song on Spotify to analyze your mood</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
