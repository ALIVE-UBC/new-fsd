import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/frontend/navbar';
import { PlayerData } from '@/frontend/components/pages/player-data';





export const Route = createFileRoute('/playerData/')({
  component: RouteComponent,
})

function RouteComponent() {
    return <NavBar children={PlayerData} />;
}
