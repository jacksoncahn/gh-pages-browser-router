import { useSimulation } from '@/hooks/useSimulation'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { generateStepCommand } from '@/utils/gromacs.utils'
import { STEP_CONFIG } from '@/constants/simulation.constants'
import { MaxWarnings } from '@/components/simulation/max-warnings'

/**
 * Step Nine: Production MD
 * Informational step - energy minimization uses default parameters
 * Advanced users can customize minimization in their own version
 */
export default function StepNine() {
  const simulation = useSimulation()
  const params = simulation.currentSimulation?.simulation_params
  const { title, description } = STEP_CONFIG[9]

  const isRunWarningEnabled = !!params?.enableRunSimulationWarning

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>

      <MaxWarnings
        enabled={isRunWarningEnabled}
        value={params?.maxRunSimulationWarnings ?? null}
        onEnabledChange={enabled => {
          simulation.updateEnableRunSimulationWarning(enabled)
        }}
        onValueChange={value => simulation.updateMaxRunSimulationWarnings(value)}
      />
      <CodeBlock code={generateStepCommand(9, simulation.currentSimulation?.simulation_params)} />
    </div>
  )
}
