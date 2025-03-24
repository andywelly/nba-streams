import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcrypt';
import { neon } from '@neondatabase/serverless';

// Extend the Session and JWT types to include the `id` property
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      favoriteTeam?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    favoriteTeam?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    favoriteTeam?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider (for email/password login)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Connect to the Neon database
        const sql = neon(`${process.env.DATABASE_URL}`);

        // Fetch the user from the database
        const response = await sql`
          SELECT * FROM users WHERE email = ${credentials.email}
        `;

        const user = response[0]; // Access the first row directly

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Compare the provided password with the hashed password in the database
        const passwordCorrect = await compare(credentials.password, user.password);

        if (passwordCorrect) {
          // Return the user object without the password
          return {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0], // Use part of email as name if you don't store names
            favoriteTeam: user.favorite_team || null,
          };
        } else {
          throw new Error('Incorrect password');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    async signIn({ user, account }) {
      // This will be called when a user signs in with any provider
      try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        
        if (account?.provider === 'google') {
          // Check if this Google user already exists in our database
          const existingUsers = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;
          
          if (existingUsers.length === 0) {
            // Create a new user if they don't exist
            await sql`
              INSERT INTO users (email, provider, provider_id)
              VALUES (${user.email}, 'google', ${user.id})
            `;
          } else {
            // Update the existing user with provider info if needed
            if (!existingUsers[0].provider || !existingUsers[0].provider_id) {
              await sql`
                UPDATE users
                SET provider = 'google', provider_id = ${user.id}
                WHERE email = ${user.email}
              `;
            }
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    
    async jwt({ token, user, account }) {
      // Add user details to the JWT token when they sign in
      if (user) {
        token.id = user.id;
        token.favoriteTeam = user.favoriteTeam;
      }
      
      // If this is a sign-in from Google, fetch the latest user data
      if (account?.provider === 'google') {
        try {
          const sql = neon(`${process.env.DATABASE_URL}`);
          const users = await sql`
            SELECT id, favorite_team FROM users WHERE email = ${token.email}
          `;
          
          if (users.length > 0) {
            token.id = users[0].id;
            token.favoriteTeam = users[0].favorite_team;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      session.user = session.user || {};
      if (token) {
        session.user.id = token.id;
        session.user.favoriteTeam = token.favoriteTeam;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};