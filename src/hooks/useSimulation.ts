import { useContext } from 'react'
import { SimulationContext } from '@/contexts/SimulationContext'

export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
