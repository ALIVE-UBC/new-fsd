import { useState, useEffect } from 'react';
import { type ReactNode } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

type Player = {
  name: string;
  startTime: string;
  endTime: string;
  mode: string;
  duration: string;
  status: boolean;
};

function PlayerTableComponent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.mode.toLowerCase().includes(searchTerm.toLowerCase())
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
        <button className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-md text-sm text-gray-600">
          Filter <span className="ml-1">▼</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-left text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No players found matching your search.' : 'No players found.'}
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{player.startTime}</td>
                  <td className="px-4 py-2">{player.endTime}</td>
                  <td className="px-4 py-2">{player.mode}</td>
                  <td className="px-4 py-2">{player.duration}</td>
                  <td className="px-4 py-2">
                    {player.status ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredPlayers.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-4 text-sm text-gray-600">
          <button 
            className="hover:underline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            &lt; Previous
          </button>
          <button className="text-gray-500">1</button>
          <button className="border border-gray-300 px-2 py-1 rounded bg-white font-semibold">2</button>
          <span className="text-gray-400">…</span>
          <button 
            className="hover:underline"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export const PlayerData: ReactNode = <PlayerTableComponent />;
