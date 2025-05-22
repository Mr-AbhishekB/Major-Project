"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { SmilePlus, Meh, Frown, BarChart3 } from "lucide-react"

interface MoodEntry {
  id: string
  trackName: string
  artistName: string
  mood: "positive" | "neutral" | "negative"
  score: number
  timestamp: string
}

export default function MoodHistory() {
  const [history, setHistory] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/history/get")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setHistory(data)
      } catch (err) {
        console.error("Failed to fetch mood history:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "positive":
        return <SmilePlus className="h-4 w-4 text-green-500" />
      case "neutral":
        return <Meh className="h-4 w-4 text-amber-500" />
      case "negative":
        return <Frown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const filteredHistory = history.filter((entry) => {
    if (activeTab === "all") return true
    return entry.mood === activeTab
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood History</CardTitle>
            <CardDescription>Your recent music mood patterns</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No mood history available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                    <div className="mt-1">{getMoodIcon(entry.mood)}</div>
                    <div>
                      <h4 className="font-medium">{entry.trackName}</h4>
                      <p className="text-sm text-muted-foreground">{entry.artistName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
