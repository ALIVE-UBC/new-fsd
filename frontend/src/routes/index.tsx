import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../frontend/components/pages/login.tsx';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Login />
  )
}
