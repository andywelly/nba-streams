// lib/utils.ts
import { Game, GroupedGames, NBA_TEAMS } from '@/types'

// Check if a title contains NBA team names
export function isNBAGame(title: string): boolean {
  const teamsFound = Object.values(NBA_TEAMS).filter(team => 
    title.includes(team)
  )
  return teamsFound.length >= 2
}

// Format game date to AEST (Australian Eastern Standard Time)
export function formatGameDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney', // AEST timezone
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

// Categorize games by date (today, tomorrow, later) using AEST
export function categorizeGamesByDate(games: Game[]): GroupedGames {
  const grouped: GroupedGames = {
    today: [],
    tomorrow: [],
    later: []
  }
  
  // Create dates using AEST timezone
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Australia/Sydney', // AEST timezone
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }

  // Get today and tomorrow dates in AEST
  const now = new Date()
  const todayStr = now.toLocaleDateString('en-AU', options)
  
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-AU', options)
  
  games.forEach(game => {
    // Parse the game date in AEST
    const gameDate = new Date(game.date)
    const gameDateStr = gameDate.toLocaleDateString('en-AU', options)
    
    if (gameDateStr === todayStr) {
      grouped.today.push(game)
    } else if (gameDateStr === tomorrowStr) {
      grouped.tomorrow.push(game)
    } else {
      grouped.later.push(game)
    }
  })
  
  return grouped
}

// Helper function to convert a date to AEST for display
export function toAESTTime(date: Date): string {
  return date.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}