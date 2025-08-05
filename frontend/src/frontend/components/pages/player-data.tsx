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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPlayers();
  }, [currentPage]);

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}, ${hours}:${minutes}`;
    } catch (error) {
      return dateTimeString;
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetch(`https://alive.educ.ubc.ca/fsd2/api/players?limit=${itemsPerPage}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
    
      if (data.data && data.pagination) {
      
        setPlayers(data.data);
        setTotalCount(data.pagination.total || data.pagination.count || 0);
      } else if (Array.isArray(data)) {
       
        setPlayers(data);
        setTotalCount(data.length);
      } else {
     
        setPlayers([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
      console.error('Error fetching players:', err);
      setPlayers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = (players || []).filter(player =>
    player.user_id.toString().includes(searchTerm) ||
    player.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(player.params).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentPlayers = filteredPlayers;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
            {currentPlayers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No players found matching your search.' : 'No players found.'}
                </td>
              </tr>
            ) : (
              currentPlayers.map((player, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{player.user_id}</td>
                  <td className="px-4 py-2">{formatDateTime(player.datetime)}</td>
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

      {filteredPlayers.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-4 text-sm text-gray-600">
          <div className="text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
          </div>
          
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`hover:underline ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
          >
            &lt; Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-2 py-1 rounded ${
                  currentPage === pageNum
                    ? 'border border-gray-300 bg-white font-semibold'
                    : 'text-gray-500 hover:underline'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="text-gray-400">…</span>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`hover:underline ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : ''}`}
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export const PlayerData: ReactNode = <PlayerTableComponent />;
