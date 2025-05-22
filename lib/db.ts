import { createClient as createVercelClient } from "@vercel/postgres"

export async function createClient() {
  const client = createVercelClient()

  // Create tables if they don't exist
  await client.sql`
    CREATE TABLE IF NOT EXISTS track_history (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      track_id TEXT NOT NULL,
      track_name TEXT NOT NULL,
      artist_name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  await client.sql`
    CREATE TABLE IF NOT EXISTS mood_history (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      track_id TEXT NOT NULL,
      track_name TEXT NOT NULL,
      artist_name TEXT NOT NULL,
      mood TEXT NOT NULL,
      score FLOAT NOT NULL,
      confidence FLOAT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  return client
}
