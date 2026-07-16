import { useNavigate } from 'react-router'
import { useSimulation } from '@/hooks/useSimulation'
import { validateStep } from '@/utils/simulation.utils'

/**
 * Custom hook for managing SimulationStep logic
 * Handles navigation, validation, and step transitions
 */
export const useSimulationLogic = (
  currentStep: number,
  totalSteps: number,
  navigate: ReturnType<typeof useNavigate>
) => {
  const simulation = useSimulation()

  /**
   * Validates the current step has all required fields filled
   */
  const isCurrentStepValid = (): boolean => {
    if (!simulation.currentSimulation) {
      return false
    }
    return validateStep(currentStep, simulation.currentSimulation)
  }

  /**
   * Navigate to next step or complete simulation
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      navigate(`/simulation/new/${currentStep + 1}`)
    } else {
      // Save simulation and go to dashboard
      simulation.completeSimulation()
      navigate('/dashboard')
    }
  }

  /**
   * Navigate to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      navigate(`/simulation/new/${currentStep - 1}`)
    }
  }

  return {
    isCurrentStepValid,
    handleNext,
    handlePrevious
  }
}
