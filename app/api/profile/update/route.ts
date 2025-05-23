import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { neon } from '@neondatabase/serverless';
import { NBA_TEAMS, NBATeam } from '@/types';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the current session using authOptions
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { favoriteTeam, watchList } = body;
    
    // Validate the favorite team if one was provided
    if (favoriteTeam && !NBA_TEAMS[favoriteTeam as NBATeam]) {
      return NextResponse.json({ error: 'Invalid team selection' }, { status: 400 });
    }
    
    // Validate watchlist teams
    if (watchList && Array.isArray(watchList)) {
      const invalidTeams = watchList.filter(team => !NBA_TEAMS[team as NBATeam]);
      if (invalidTeams.length > 0) {
        return NextResponse.json({ 
          error: 'Invalid teams in watchlist', 
          invalidTeams 
        }, { status: 400 });
      }

      // Prevent duplicate teams in watchlist
      const uniqueWatchList = [...new Set(watchList)];

      // Limit watchlist to a reasonable number (e.g., 10 teams)
      const limitedWatchList = uniqueWatchList.slice(0, 10);
      
      // Connect to database
      const sql = neon(`${process.env.DATABASE_URL}`);
      
      // Update the user's favorite team and watchlist
      await sql`
        UPDATE users 
        SET 
          favorite_team = ${favoriteTeam || null},
          "watchList" = ${limitedWatchList.length > 0 ? `{${limitedWatchList.join(',')}}` : null}
        WHERE id = ${session.user.id}
      `;
      
      return NextResponse.json({ 
        success: true, 
        message: 'Profile updated successfully',
        data: { 
          favoriteTeam, 
          watchList: limitedWatchList 
        }
      });
    }
    
    // If no watchList provided, update just the favorite team
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
      UPDATE users 
      SET 
        favorite_team = ${favoriteTeam || null},
        "watchList" = null
      WHERE id = ${session.user.id}
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: { favoriteTeam, watchList: null }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}