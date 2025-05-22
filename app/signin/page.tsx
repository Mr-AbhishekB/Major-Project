"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Spotify Mood Analyzer</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Connect your Spotify account to analyze your music and get mental health insights
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Connect your Spotify Premium account to begin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => signIn("spotify")}
          >
            Sign in with Spotify
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center">
          Powered by NextAuth.js + Spotify
        </CardFooter>
      </Card>
    </div>
  )
}
