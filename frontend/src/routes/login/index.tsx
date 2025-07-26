import { createFileRoute } from '@tanstack/react-router'
import {Login} from '@/frontend/components/pages/login.tsx'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />;
}
