import { useSimulation } from '@/hooks/useSimulation'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { generateStepCommand } from '@/utils/gromacs.utils'
import { STEP_CONFIG } from '@/constants/simulation.constants'
import { MaxWarnings } from '@/components/simulation/max-warnings'

/**
 * Step Six: Energy Minimization
 * Informational step - energy minimization uses default parameters
 * Advanced users can customize minimization in their own version
 */
export default function StepSix() {
  const simulation = useSimulation()
  const { title, description } = STEP_CONFIG[6]

  const params = simulation.currentSimulation?.simulation_params
  const isMinimizationWarningEnabled = Boolean(params?.enableMaxMinimizationWarning)

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <MaxWarnings
        enabled={isMinimizationWarningEnabled}
        value={params?.maxMinimizationWarnings ?? null}
        onEnabledChange={enabled => {
          simulation.updateEnableMaxMinimizationWarning(enabled)
        }}
        onValueChange={value => simulation.updateMinimizationMaxWarnings(value)}
      />
      <CodeBlock code={generateStepCommand(6, simulation.currentSimulation?.simulation_params)} />
    </div>
  )
}
