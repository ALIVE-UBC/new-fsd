import { createFileRoute } from '@tanstack/react-router';
import NavBar from '@/frontend/navbar';
import { MainFeedPage } from '@/frontend/components/pages/main-feed';

export function DashboardPage() {
  return <NavBar children={MainFeedPage} />;
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});
