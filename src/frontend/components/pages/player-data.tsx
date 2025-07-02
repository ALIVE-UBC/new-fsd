import { useState } from 'react';
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

const players: Player[] = [
  { name: 'Player1', startTime: '12:31', endTime: '14:00', mode: 'Hard', duration: '14min', status: true },
  { name: 'Player2', startTime: '14:31', endTime: '16:00', mode: 'Medium', duration: '13min', status: true },
  { name: 'Player3', startTime: '15:31', endTime: '17:21', mode: 'Easy', duration: '45min', status: false },
  { name: 'Player4', startTime: '16:31', endTime: '18:31', mode: 'Hard', duration: '13min', status: false },
  { name: 'Player5', startTime: '17:31', endTime: '11:24', mode: 'Easy', duration: '20min', status: true },
  { name: 'Player6', startTime: '18:31', endTime: '20:45', mode: 'Medium', duration: '25min', status: false },
  { name: 'Player6', startTime: '18:31', endTime: '20:45', mode: 'Medium', duration: '25min', status: false },
  { name: 'Player6', startTime: '18:31', endTime: '20:45', mode: 'Medium', duration: '25min', status: false },
  { name: 'Player6', startTime: '18:31', endTime: '20:45', mode: 'Medium', duration: '25min', status: false },
];

function PlayerTableComponent() {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <div className="p-6 space-y-6">
      {/* Top Controls */}
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

      {/* Table */}
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

      {/* Pagination */}
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
