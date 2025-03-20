import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
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
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };