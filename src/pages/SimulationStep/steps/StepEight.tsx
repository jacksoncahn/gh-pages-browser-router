import { useSimulation } from "@/hooks/useSimulation";
import { CheckboxItem } from "@/components/shared/CheckboxItem";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Eight: System Validation
 * Users select which system properties to validate after equilibration
 * Options include temperature, pressure, and system volume
 */
export default function StepEight() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;
  const showCodeBlock = params?.verificationParams?.temperature || params?.verificationParams?.pressure || params?.verificationParams?.system_volume;
  const { title, description } = STEP_CONFIG[8];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="flex flex-col gap-3 mt-4">
        {/* Temperature Validation */}
        <CheckboxItem
          label="Temperature"
          checked={params?.verificationParams?.temperature || false}
          onChange={(checked) =>
            simulation.updateVerification("temperature", checked)
          }
        />

        {/* Pressure Validation */}
        <CheckboxItem
          label="Pressure"
          checked={params?.verificationParams?.pressure || false}
          onChange={(checked) =>
            simulation.updateVerification("pressure", checked)
          }
        />

        {/* System Volume Validation */}
        <CheckboxItem
          label="System Volume"
          checked={params?.verificationParams?.system_volume || false}
          onChange={(checked) =>
            simulation.updateVerification("system_volume", checked)
          }
        />
      </div>

      {showCodeBlock &&
        <CodeBlock
        code={generateStepCommand(
          8,
          simulation.currentSimulation?.simulation_params,
        )}
      />}
    </div>
  );
}
