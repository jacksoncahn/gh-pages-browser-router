import { Card, CardContent, CardTitle } from '../ui/card'
import { Atom, Circle } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router'
import type { JSX } from 'react'

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

const badgeMap: Record<string, JSX.Element> = {
  complete: (
    <Badge variant="outline">
      <Circle data-icon="inline-start" className="fill-success text-success" />
      Complete
    </Badge>
  ),
  running: (
    <Badge variant="outline">
      <Circle data-icon="inline-start" className="fill-warning text-warning" />
      Running
    </Badge>
  ),
  paused: (
    <Badge variant="outline">
      <Circle data-icon="inline-start" className="fill-secondary text-secondary" />
      Paused
    </Badge>
  )
}

const defaultBadge: JSX.Element = <Badge variant="outline">Loading...</Badge>

export function SimulationCard({ simulation, status }: SimulationCardProps) {
  const navigate = useNavigate()

  const getStatusBadge = () => badgeMap[status] ?? defaultBadge

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
