import { useParams } from 'react-router'

// Import all step components
import StepZero from './steps/StepZero'
import StepOne from './steps/StepOne'
import StepTwo from './steps/StepTwo'
import StepThree from './steps/StepThree'
import StepFour from './steps/StepFour'
import StepFive from './steps/StepFive'
import StepSix from './steps/StepSix'
import StepSeven from './steps/StepSeven'
import StepEight from './steps/StepEight'
import StepNine from './steps/StepNine'
import StepTen from './steps/StepTen'

/**
 * Array of step components mapped by step number (0-10)
 */
const STEP_COMPONENTS = [
  StepZero,
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
  StepSeven,
  StepEight,
  StepNine,
  StepTen
]

/**
 * SimulationStep: Main router component for the 9-step simulation wizard
 * Routes to the appropriate step component based on the URL parameter
 * Note: Navigation buttons are handled in CreateSimulation parent component
 */
export default function SimulationStep() {
  const { stepNumber } = useParams()
  const currentStep = parseInt(stepNumber || '0')

  // Get the appropriate step component
  const StepComponent = STEP_COMPONENTS[currentStep]

  // Handle invalid step
  if (!StepComponent) {
    return <div className="text-center py-8">Invalid step</div>
  }

  return (
    <div className="w-full max-w-3xl px-4">
      <StepComponent />
    </div>
  )
}
