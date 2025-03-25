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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Your Profile
          </h1>
          
          {user && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold text-gray-800">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Login Method:</span> {user.provider ? `${user.provider} OAuth` : 'Email & Password'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="favoriteTeam" className="block text-sm font-medium text-gray-700 mb-2">
                    Favorite Team
                  </label>
                  <select
                    id="favoriteTeam"
                    value={favoriteTeam}
                    onChange={(e) => setFavoriteTeam(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Watchlist Teams
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(NBA_TEAMS).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`team-${key}`}
                          checked={watchList.includes(key)}
                          onChange={() => handleWatchlistToggle(key)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2 transition"
                        />
                        <label 
                          htmlFor={`team-${key}`} 
                          className="text-sm text-gray-700"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {message.text && (
                  <div className={`p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}