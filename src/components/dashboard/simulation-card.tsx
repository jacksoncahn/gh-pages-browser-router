import { Card, CardContent, CardTitle } from '../ui/card'
import { Atom, Circle } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router'

type SimulationStatus = 'paused' | 'running' | 'complete' | 'unknown'

interface SimulationCardProps {
  simulation: {
    id: number
    name: string
    proteinID: string
    status: string
  }
  status: SimulationStatus
}
export function SimulationCard({ simulation, status }: SimulationCardProps) {
  const navigate = useNavigate()

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline">
            <Circle data-icon="inline-start" className="fill-success text-success" />
            Complete
          </Badge>
        )
      case 'running':
        return (
          <Badge variant="outline">
            <Circle data-icon="inline-start" className="fill-warning text-warning" />
            Running
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline">
            <Circle data-icon="inline-start" className="fill-secondary text-secondary" />
            Paused
          </Badge>
        )
      default:
        return <Badge variant="outline">Loading...</Badge>
    }
  }

  const handleClick = () => {
    navigate(`/simulation/${simulation.id}`)
  }

  return (
    <Card
      className="cursor-pointer w-full p-5 focus-visible:outline-2 focus-visible:outline-ring"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* TODO: could add picture representation of sim */}
      <CardTitle className="text-xl text-left mb-0.5">{simulation.name}</CardTitle>
      <CardContent className="p-0">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-row gap-3 items-center text-sm">
            <Atom className="size-5" />
            <p className="text-sm">{simulation.proteinID}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardContent>
    </Card>
  )
}
