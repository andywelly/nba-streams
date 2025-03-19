// lib/api.ts
import { Game } from '@/types'
import { isNBAGame } from './utils'

const API_URL = "https://streamed.su/api/matches/basketball/popular"

// Fetch NBA games from API
export async function fetchNBAGames(): Promise<Game[]> {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Filter only NBA games
    return data.filter((game: Game) => isNBAGame(game.title))
  } catch (error) {
    console.error("Error fetching NBA games:", error)
    throw error
  }
}