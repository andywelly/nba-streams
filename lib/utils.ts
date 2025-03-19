// lib/utils.ts
import { Game, GroupedGames, NBA_TEAMS } from '@/types'

// Check if a title contains NBA team names
export function isNBAGame(title: string): boolean {
  const teamsFound = Object.values(NBA_TEAMS).filter(team => 
    title.includes(team)
  )
  return teamsFound.length >= 2
}

// Format game date to US Eastern time
export function formatGameDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

// Categorize games by date (today, tomorrow, later)
export function categorizeGamesByDate(games: Game[]): GroupedGames {
  const grouped: GroupedGames = {
    today: [],
    tomorrow: [],
    later: []
  }
  
  // Create dates using US timezone
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'America/New_York',
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }

  // Get today and tomorrow dates in US timezone
  const now = new Date()
  const todayStr = now.toLocaleDateString('en-US', options)
  
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-US', options)
  
  games.forEach(game => {
    // Parse the game date
    const gameDate = new Date(game.date)
    const gameDateStr = gameDate.toLocaleDateString('en-US', options)
    
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