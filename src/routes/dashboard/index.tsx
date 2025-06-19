import { createFileRoute } from '@tanstack/react-router';
import NavBar from '@/frontend/navbar';
import { MainFeed } from '@/frontend/components/pages/main-feed';

export function DashboardPage() {
  return <NavBar children={MainFeed} />;
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});
