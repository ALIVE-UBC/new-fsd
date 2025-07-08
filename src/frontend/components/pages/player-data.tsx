import React, { useState, useEffect } from 'react';
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

async function fetchPlayerData(): Promise<Player[]> {
  try {
    const response = await fetch('http://localhost:8028/metrics/player-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching player data:', error);
    return [];
  }
}

function PlayerTableComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPlayerData();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading player data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
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
          <tbody>
            {players.map((player, idx) => (
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 pt-4 text-sm text-gray-600">
        <button className="hover:underline">&lt; Previous</button>
        <button className="text-gray-500">1</button>
        <button className="border border-gray-300 px-2 py-1 rounded bg-white font-semibold">2</button>
        <span className="text-gray-400">…</span>
        <button className="hover:underline">Next &gt;</button>
      </div>
    </div>
  );
}

export const PlayerData: ReactNode = <PlayerTableComponent />;
