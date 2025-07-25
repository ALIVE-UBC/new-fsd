import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/frontend/navbar.tsx';
import { AdminPage } from '@/frontend/components/pages/admin.tsx';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
    return <NavBar children={AdminPage} />;
}
