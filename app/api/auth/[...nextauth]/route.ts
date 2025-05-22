import NextAuth from "next-auth/next"
import SpotifyProvider from "next-auth/providers/spotify"

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,user-read-playback-state,user-read-currently-playing&redirect_uri=http://127.0.0.1:3000/api/auth/callback/spotify",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }
