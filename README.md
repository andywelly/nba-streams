# NBA Streams

NBA Streams provides an easy-to-use platform for basketball fans to find and watch NBA games. The application offers both authenticated user experiences and a guest mode for quick access.

## Screenshots
<img width="1493" alt="nba" src="https://github.com/user-attachments/assets/14595d8a-82b9-4da9-b811-287f96e78c02" />

## Features

- **User Authentication**: Secure login and registration system
- **Guest Mode**: Access game listings without creating an account
- **Live Game Streams**: Watch NBA games directly in the application
- **Game Scheduling**: View today's games, tomorrow's games, and upcoming fixtures
- **Responsive Design**: Fully optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nba-streams.git
   cd nba-streams
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # Add any other required API keys or credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── app/                  # Next.js app router pages
│   ├── /                 # Landing page
│   ├── home/             # Main games dashboard
│   ├── login/            # Authentication pages
│   ├── register/
│   ├── about/
│   ├── contact/
│   └── profile/          # User profile page
├── components/           # Reusable React components
│   ├── Header.tsx        # Main navigation header
│   ├── GameList.tsx      # Game listings component
│   ├── GamePlayer.tsx    # Video player component
│   └── ...
├── lib/                  # Utility functions and API calls
│   ├── api.ts            # API function for fetching games
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Authentication Flow

The application supports:
- Email/password authentication or Google Oauth
- Guest mode access with limited features
- Session persistence using NextAuth.js

## Guest Mode

Users can browse the site and view game listings without creating an account by using the "Continue as Guest" option on the landing page. Guest users have a persistent banner reminding them to sign up for a full experience.

## Routes

- `/`: Landing page with authentication options
- `/home`: Main dashboard (requires authentication or guest mode)
- `/home?guest=true`: Guest mode access to the dashboard
- `/login`: User login page
- `/register`: New user registration
- `/about`: About page
- `/contact`: Contact information
- `/profile`: User profile (authenticated users only)

## Development Notes

### Important Considerations

- Guest mode functionality is implemented by preserving the `?guest=true` query parameter across navigation
- Authentication status is checked in protected routes to redirect unauthorized users
- The Header component dynamically adjusts based on authentication state

## License

MIT License Copyright (c) 2025 Andwele Ancheta
