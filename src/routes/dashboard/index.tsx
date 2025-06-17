import { createFileRoute } from '@tanstack/react-router';
import NavBar from '@/components/navbar';
import { MainFeed } from '@/components/main-feed';

export function DashboardPage() {
  return <NavBar children={MainFeed} />;
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});
