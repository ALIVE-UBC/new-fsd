import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/frontend/navbar';
import { AdminPage } from '@/frontend/components/pages/admin';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
    return <NavBar children={AdminPage} />;
}
