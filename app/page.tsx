import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import CurrentlyPlaying from "@/components/currently-playing"
import MoodInsights from "@/components/mood-insights"
import MoodHistory from "@/components/mood-history"

export default async function Home() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("auth-session")

  // If no session cookie, redirect to signin page
  if (!sessionCookie) {
    redirect("/signin")
  }

  return (
    <div className="container py-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Spotify Mood Analyzer</h1>
          <p className="text-muted-foreground">Hello, Demo User</p>
        </div>
        <Button asChild variant="outline">
          <a href="/signout">Sign Out</a>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrentlyPlaying />
        <MoodInsights />
      </div>

      <MoodHistory />
    </div>
  )
}
