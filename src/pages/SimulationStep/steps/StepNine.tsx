import { useSimulation } from "@/hooks/useSimulation";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Nine: Production MD
 * Informational step - energy minimization uses default parameters
 * Advanced users can customize minimization in their own version
 */
export default function StepNine() {
  const simulation = useSimulation();
  const { title, description } = STEP_CONFIG[9];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <CodeBlock
        code={generateStepCommand(
          9,
          simulation.currentSimulation?.simulation_params,
        )}
      />
    </div>
  );
}
