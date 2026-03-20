import { Input } from "@/components/ui/input";
import { useSimulation } from "@/contexts/SimulationContext";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { CodeBlock } from "@/components/shared/CodeBlock";
import {
  PositiveIonTypes,
  NegativeIonTypes,
  type PositiveIonType,
  type NegativeIonType,
} from "@/types/simulation.types";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Five: Ionization
 * Users select positive and negative ions to neutralize the system
 * and specify the solvent group and ion concentration
 */
export default function StepFive() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;
  const { title, description } = STEP_CONFIG[5];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="flex flex-col gap-8 mt-4">
        {/* Ion Type Selection */}
        <div className="flex flex-row gap-4">
          <ControlledCombobox
            label="Positive Ion"
            items={Object.values(PositiveIonTypes)}
            value={params?.positiveIon}
            onChange={(value) =>
              simulation.updatePositiveIon(value as PositiveIonType)
            }
          />
          <ControlledCombobox
            label="Negative Ion"
            items={Object.values(NegativeIonTypes)}
            value={params?.negativeIon}
            onChange={(value) =>
              simulation.updateNegativeIon(value as NegativeIonType)
            }
          />
        </div>

        {/* Solvent Group and Ion Concentration */}
        <div className="flex flex-row w-full gap-4">
          <ControlledCombobox
            label="Solvent Group"
            // TODO: replace this with actual supported solvent groups once we have them defined
            items={["SOL", "WAT", "HOH"]}
            value={(params as any)?.solventGroup}
            onChange={(value) => simulation.updateSolventGroup(value)}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ion Concentration (M)</label>
            <Input
              type="number"
              placeholder="e.g. 0.15"
              step="0.05"
              min="0"
              value={(params as any)?.ion_concentration || ""}
              onChange={(e) =>
                simulation.updateIonConcentration(
                  parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
        </div>
      </div>
      <CodeBlock
        code={generateStepCommand(
          5,
          simulation.currentSimulation?.simulation_params,
        )}
      />
    </div>
  );
}
