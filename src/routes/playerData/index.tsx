import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/frontend/navbar-simple.tsx';
import { PlayerData } from '@/frontend/components/pages/player-data.tsx';





export const Route = createFileRoute('/playerData/')({
  component: RouteComponent,
})

function RouteComponent() {
    return <NavBar children={PlayerData} />;
}
