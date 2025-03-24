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
    const { favoriteTeam } = body;
    
    // Validate the favorite team if one was provided
    if (favoriteTeam && !NBA_TEAMS[favoriteTeam as NBATeam]) {
      return NextResponse.json({ error: 'Invalid team selection' }, { status: 400 });
    }
    
    // Connect to database
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Update the user's favorite team
    await sql`
      UPDATE users 
      SET favorite_team = ${favoriteTeam || null} 
      WHERE id = ${session.user.id}
    `;
    
    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}