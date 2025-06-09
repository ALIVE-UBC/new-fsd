import { useState } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { LocationEvent } from '../types/location';
import { processUserData, getLocationData } from '../utils/locationProcessor';

interface UserHeatmapProps {
  events: LocationEvent[];
}

const UserHeatmap = ({ events }: UserHeatmapProps) => {
  const userData = processUserData(events);
  const { locations } = getLocationData();
  const [selectedUser, setSelectedUser] = useState(userData[0]?.userId || '');

  const selectedUserData = userData.find(user => user.userId === selectedUser);

  const getColor = (value: number) => {
    const max = Math.max(...(selectedUserData?.data || [0]));
    const intensity = value / max;
    return `rgba(255, 0, 0, ${intensity})`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Select User</InputLabel>
        <Select
          value={selectedUser}
          label="Select User"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {userData.map(({ userId }) => (
            <MenuItem key={userId} value={userId}>
              User {userId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedUserData && (
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${locations.length}, 1fr)`,
            gap: 1,
            p: 2,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
          }}>
            {locations.map((location, index) => (
              <Box
                key={location}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: getColor(selectedUserData.data[index]),
                  color: 'white',
                  borderRadius: 1,
                  fontWeight: 'bold',
                  textShadow: '0 0 2px rgba(0,0,0,0.5)',
                }}
              >
                {location}
                <Box sx={{ mt: 1, fontSize: '0.8em' }}>
                  {selectedUserData.data[index]} entries
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: '0.8em' }}>Low</Box>
            <Box sx={{ 
              flex: 1, 
              height: 20, 
              background: 'linear-gradient(to right, rgba(255,0,0,0.1), rgba(255,0,0,1))',
              borderRadius: 1,
            }} />
            <Box sx={{ fontSize: '0.8em' }}>High</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserHeatmap; 