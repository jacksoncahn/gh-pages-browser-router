import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { ModeToggle } from './mode-toggle'
import { useNavigate } from 'react-router'
import { DRAFT_SIMULATION_KEY } from '@/utils/simulation.utils'

export function NavBar({ showButton = true }: { showButton?: boolean }) {
  const navigate = useNavigate()

  const handleNewSimulation = () => {
    sessionStorage.removeItem(DRAFT_SIMULATION_KEY)
    navigate('/simulation/new/0')
  }

  return (
    <header className="sticky top-0 flex w-full h-16 items-center justify-between border-b bg-background px-4 md:px-6 mb-4">
      <h1 className="text-xl font-semibold">
        <button
          type="button"
          className="cursor-pointer outline-none focus-visible:underline"
          onClick={() => navigate('/dashboard')}
        >
          MD GOOEY
        </button>
      </h1>
      <div className="space-x-2 flex items-center">
        <ModeToggle />
        {showButton && (
          <Button size="lg" onClick={handleNewSimulation}>
            <Plus />
            new simulation
          </Button>
        )}
      </div>
    </header>
  )
}
