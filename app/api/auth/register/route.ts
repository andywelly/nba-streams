import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Insert the user into the database
    await sql`
      INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})
    `;

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error during registration:', e);
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    );
  }
}