"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignOut() {
  const router = useRouter()

  useEffect(() => {
    // Clear the auth cookie
    document.cookie = "auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Redirect to signin page
    router.push("/signin")
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <p>Signing out...</p>
    </div>
  )
}
