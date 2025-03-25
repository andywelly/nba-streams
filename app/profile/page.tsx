'use client';

import '@/app/globals.css';
import { useState, useEffect } from 'react';
import { NBA_TEAMS, User } from '@/types';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [watchList, setWatchList] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        
        const userData = await response.json();
        setUser(userData);
        setFavoriteTeam(userData.favoriteTeam || '');
        setWatchList(userData.watchList || []);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/api/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          favoriteTeam, 
          watchList 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      let errorMessage = 'Failed to update profile';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleWatchlistToggle = (teamKey: string) => {
    setWatchList(prevWatchList => 
      prevWatchList.includes(teamKey)
        ? prevWatchList.filter(team => team !== teamKey)
        : [...prevWatchList, teamKey]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {user && (
          <>
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">Login Method:</span> {user.provider ? `${user.provider} OAuth` : 'Email & Password'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="favoriteTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Favorite Team
                </label>
                <select
                  id="favoriteTeam"
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a team</option>
                  {Object.entries(NBA_TEAMS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Watchlist Teams
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(NBA_TEAMS).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`team-${key}`}
                        checked={watchList.includes(key)}
                        onChange={() => handleWatchlistToggle(key)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`team-${key}`} 
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {message.text && (
                <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}
              
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}