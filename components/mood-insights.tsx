"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { SmilePlus, Meh, Frown, Music2 } from "lucide-react"

interface MoodData {
  mood: "positive" | "neutral" | "negative"
  score: number
  artist: string
  confidence: number
}

export default function MoodInsights() {
  const [moodData, setMoodData] = useState<MoodData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/mood/analyze")

        if (!response.ok) {
          if (response.status === 204) {
            setMoodData(null)
            return
          }
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setMoodData(data)
      } catch (err) {
        console.error("Failed to fetch mood data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMoodData()

    // Refresh when track changes
    const interval = setInterval(fetchMoodData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "positive":
        return <SmilePlus className="h-8 w-8 text-green-500" />
      case "neutral":
        return <Meh className="h-8 w-8 text-amber-500" />
      case "negative":
        return <Frown className="h-8 w-8 text-red-500" />
      default:
        return <Music2 className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "bg-green-500"
      case "neutral":
        return "bg-amber-500"
      case "negative":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMoodDescription = (mood: string) => {
    switch (mood) {
      case "positive":
        return "You're listening to uplifting music that may boost your mood and energy levels."
      case "neutral":
        return "Your current music selection has a balanced emotional tone."
      case "negative":
        return "You're listening to music with more melancholic or intense emotional themes."
      default:
        return "Start playing music to get mood insights."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Insights</CardTitle>
        <CardDescription>Analysis of your current music mood</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ) : !moodData ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No mood data available</p>
            <p className="text-sm text-muted-foreground mt-2">Start playing a song on Spotify to analyze your mood</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {getMoodIcon(moodData.mood)}
              <div>
                <h3 className="text-xl font-semibold capitalize">{moodData.mood} Mood</h3>
                <p className="text-sm text-muted-foreground">{getMoodDescription(moodData.mood)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mood Intensity</span>
                <span>{Math.round(moodData.score * 100)}%</span>
              </div>
              <Progress value={moodData.score * 100} className={getMoodColor(moodData.mood)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prediction Confidence</span>
                <span>{Math.round(moodData.confidence * 100)}%</span>
              </div>
              <Progress value={moodData.confidence * 100} />
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Based on your listening patterns and {moodData.artist}'s music style
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
