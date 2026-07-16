import { useSimulation } from "@/hooks/useSimulation";
import { STEP_CONFIG } from "@/constants/simulation.constants";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { GromacsVersions, type GromacsVersion } from "@/types/simulation.types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

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
        placeholder="version"
        items={Object.values(GromacsVersions)}
        value={params?.gromacsVersion}
        onChange={(value) =>
          simulation.updateGromacsVersion(value as GromacsVersion)
        }
        horizontal={true}
      />

      <FieldGroup className="mt-2 items-center">
        <Field orientation="horizontal" className="justify-center">
          <Checkbox
            id="use-gpu"
            name="use-gpu"
            checked={!!params?.useGpu}
            onCheckedChange={(checked) =>
              simulation.updateUseGpu(checked === true)
            }
          />
          <FieldLabel htmlFor="use-gpu" className="flex-none!">
            Run on GPU (adds -nb gpu to mdrun commands)
          </FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  );
}
