import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/frontend/components/pages/login';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Login />
  )
}
