import { useSimulation } from "@/contexts/SimulationContext";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Seven: Equilibration
 * Users select the equilibration type (NVT, NPT, or both)
 * Provides guidance on required configuration files for advanced options
 */
export default function StepSeven() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;
  const { title, description } = STEP_CONFIG[7];
  const equilibrationType = (params as any)?.equilibriationOptions;

  // Check if user selected an equilibration type that requires configuration files
  const requiresConfigFiles =
    equilibrationType === "nvt" ||
    equilibrationType === "npt" ||
    equilibrationType === "both";

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <ControlledCombobox
        label="Equilibration Type"
        items={["None", "NPT", "NVT", "Both"]}
        placeholder="eg. npt"
        value={equilibrationType}
        onChange={(value) =>
          simulation.updateEquilibriation(value.toLowerCase() as any)
        }
        horizontal
      />

      {/* Conditional warning for NVT/NPT equilibration */}
      {requiresConfigFiles && (
        <p className="text-sm text-muted-foreground mt-2">
          For NVT and/or NPT equilibriation, you must have the respective{" "}
          <code>nvt.mdp</code> and/or <code>npt.mdp</code> files in your project
          directory with the appropriate parameters set. The generated script
          will use those files for equilibration.
        </p>
      )}

      {requiresConfigFiles && (
        <CodeBlock
          code={generateStepCommand(
            7,
            simulation.currentSimulation?.simulation_params,
          )}
        />
      )}
    </div>
  );
}
