import { useSimulation } from "@/hooks/useSimulation";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { CodeBlock } from "@/components/shared/CodeBlock";
import {
  ForceFields,
  WaterModels,
  ForceFieldToWaterModelMap,
  type ForceField,
  type WaterModel,
} from "@/types/simulation.types";
import { generateStepCommand } from "@/utils/gromacs.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Three: Topology Creation
 * Users select force field and compatible water model for the simulation
 */
export default function StepThree() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;
  const { title, description } = STEP_CONFIG[3];

  /**
   * Get allowed water models for the selected force field
   * Returns all available models if no force field is selected
   */
  const getAllowedWaterModels = (): WaterModel[] => {
    const forceField = params?.forceField;
    if (!forceField) return Object.values(WaterModels);
    return ForceFieldToWaterModelMap[forceField] || Object.values(WaterModels);
  };

  /**
   * Handle force field change with water model validation
   * If current water model isn't compatible with the new force field, reset it
   */
  const handleForceFieldChange = (newForceField: ForceField) => {
    simulation.updateForceField(newForceField);

    const currentWaterModel = params?.waterModel;
    const allowedModels = ForceFieldToWaterModelMap[newForceField];

    // Reset water model if it's not compatible with the new force field
    if (currentWaterModel && !allowedModels.includes(currentWaterModel)) {
      simulation.updateWaterModel("" as WaterModel);
    }
  };

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
        <ControlledCombobox
          label="Force Field"
          items={Object.values(ForceFields)}
          value={params?.forceField}
          onChange={(value) => handleForceFieldChange(value as ForceField)}
        />
        <ControlledCombobox
          label="Water Model"
          items={getAllowedWaterModels()}
          value={params?.waterModel}
          onChange={(value) => simulation.updateWaterModel(value as WaterModel)}
          placeholder={
            params?.forceField
              ? "Select water model"
              : "Select force field first"
          }
        />
      </div>
      <CodeBlock
        code={generateStepCommand(
          3,
          simulation.currentSimulation?.simulation_params,
        )}
      />
    </div>
  );
}
