import { useState, useEffect } from 'react';
import { type ReactNode } from 'react';

// DB schema: user_id, datetime, type, params

type Player = {
  user_id: number;
  datetime: string;
  type: string;
  params: any;
};

function PlayerTableComponent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/players');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.user_id.toString().includes(searchTerm) ||
    player.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(player.params).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading players...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error: {error}
            <button 
              onClick={fetchPlayers}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-1/3"
        />
      </div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-left text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Datetime</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Params</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No players found matching your search.' : 'No players found.'}
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{player.user_id}</td>
                  <td className="px-4 py-2">{player.datetime}</td>
                  <td className="px-4 py-2">{player.type}</td>
                  <td className="px-4 py-2 whitespace-pre-wrap max-w-xs">
                    <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto">{JSON.stringify(player.params, null, 2)}</pre>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const PlayerData: ReactNode = <PlayerTableComponent />;
