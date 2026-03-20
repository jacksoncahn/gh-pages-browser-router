import { Input } from "@/components/ui/input";
import { useSimulation } from "@/contexts/SimulationContext";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { BoxTypes, type BoxType } from "@/types/simulation.types";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Four: Box Definition and Solvation
 * Users define the box dimensions and type for solvating the protein
 */
export default function StepFour() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;
  const { title, description } = STEP_CONFIG[4];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Distance (nm)</label>
          <Input
            type="number"
            placeholder="e.g. 1.0"
            step="0.1"
            min="0.1"
            value={(params as any)?.boxDistance || ""}
            onChange={(e) =>
              simulation.updateBoxDistance(parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <ControlledCombobox
          label="Box Type"
          items={Object.values(BoxTypes)}
          value={params?.boxType}
          onChange={(value) => simulation.updateBoxType(value as BoxType)}
        />
      </div>
      <CodeBlock
        code={generateStepCommand(
          4,
          simulation.currentSimulation?.simulation_params,
        )}
      />
    </div>
  );
}
