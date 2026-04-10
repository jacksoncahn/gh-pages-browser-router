import { useSimulation } from "@/contexts/SimulationContext";
import { STEP_CONFIG } from "@/constants/simulation.constants";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { GromacsVersions, type GromacsVersion } from "@/types/simulation.types";

export default function StepOne() {
  const simulation = useSimulation();
  const params = simulation.currentSimulation?.simulation_params;

  const { title, description } = STEP_CONFIG[1];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <ControlledCombobox
        label="Gromacs Version"
        items={Object.values(GromacsVersions)}
        value={params?.gromacsVersion}
        onChange={(value) =>
          simulation.updateGromacsVersion(value as GromacsVersion)
        }
        horizontal={true}
      />
    </div>
  );
}
