import { useState } from 'react'
import UserHeatmap from './components/UserHeatmap'
import type { LocationEvent } from './types/location'
import './App.css'

const sampleData: LocationEvent[] = [
  {
    id: "13875",
    userId: "680080",
    timestamp: "2023-07-20 18:37:15.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  {
    id: "14034",
    userId: "680080",
    timestamp: "2023-07-20 18:39:18.000000",
    eventType: "ZONE_EXIT",
    location: { Name: "ALIVE LAB" }
  },
  {
    id: "14116",
    userId: "680080",
    timestamp: "2023-07-20 18:40:19.000000",
    eventType: "ZONE_EXIT",
    location: { Name: "Red River Town" }
  },
  {
    id: "14121",
    userId: "680080",
    timestamp: "2023-07-20 18:40:24.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "14980",
    userId: "680080",
    timestamp: "2023-07-20 18:56:24.000000",
    eventType: "ZONE_EXIT",
    location: { Name: "Red River Town" }
  },
  {
    id: "14981",
    userId: "680080",
    timestamp: "2023-07-20 18:56:24.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  // User 324349 data
  {
    id: "13355",
    userId: "324349",
    timestamp: "2023-07-20 18:25:02.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  {
    id: "13359",
    userId: "324349",
    timestamp: "2023-07-20 18:25:32.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "13414",
    userId: "324349",
    timestamp: "2023-07-20 18:27:43.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  {
    id: "13431",
    userId: "324349",
    timestamp: "2023-07-20 18:28:18.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "13446",
    userId: "324349",
    timestamp: "2023-07-20 18:28:58.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "13468",
    userId: "324349",
    timestamp: "2023-07-20 18:29:44.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "13538",
    userId: "324349",
    timestamp: "2023-07-20 18:31:30.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Sugar Factory" }
  },
  {
    id: "13587",
    userId: "324349",
    timestamp: "2023-07-20 18:32:42.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Southern Woods" }
  },
  {
    id: "13641",
    userId: "324349",
    timestamp: "2023-07-20 18:33:46.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "13660",
    userId: "324349",
    timestamp: "2023-07-20 18:34:06.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "13681",
    userId: "324349",
    timestamp: "2023-07-20 18:34:23.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  // User 999006 data
  {
    id: "19236",
    userId: "999006",
    timestamp: "2023-08-17 18:35:52.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "ALIVE LAB" }
  },
  {
    id: "19330",
    userId: "999006",
    timestamp: "2023-08-17 18:39:07.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "19451",
    userId: "999006",
    timestamp: "2023-08-17 18:41:37.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "19519",
    userId: "999006",
    timestamp: "2023-08-17 18:42:46.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Southern Woods" }
  },
  {
    id: "19533",
    userId: "999006",
    timestamp: "2023-08-17 18:42:56.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "19569",
    userId: "999006",
    timestamp: "2023-08-17 18:43:31.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Checker Board Farm" }
  },
  {
    id: "19644",
    userId: "999006",
    timestamp: "2023-08-17 18:44:47.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "19698",
    userId: "999006",
    timestamp: "2023-08-17 18:45:34.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Sugar Factory" }
  },
  {
    id: "19853",
    userId: "999006",
    timestamp: "2023-08-17 18:47:36.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Sugar Factory" }
  },
  {
    id: "19866",
    userId: "999006",
    timestamp: "2023-08-17 18:47:46.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "19876",
    userId: "999006",
    timestamp: "2023-08-17 18:47:55.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Red River Town" }
  },
  {
    id: "19889",
    userId: "999006",
    timestamp: "2023-08-17 18:48:06.000000",
    eventType: "ZONE_ENTER",
    location: { Name: "Southern Woods" }
  }
]

function App() {
  const [data] = useState(sampleData)

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <UserHeatmap events={data} />
    </div>
  )
}

export default App
