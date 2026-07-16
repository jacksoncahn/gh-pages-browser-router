import { Input } from "@/components/ui/input";
import { useSimulation } from "@/hooks/useSimulation";
import { STEP_CONFIG } from "@/constants/simulation.constants";

export default function StepZero() {
  const simulation = useSimulation();
  const { title, description } = STEP_CONFIG[0];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <label htmlFor="simulation-name" className="sr-only">
        Simulation Name
      </label>
      <Input
        id="simulation-name"
        placeholder="eg. Adenylate Kinase in Water"
        className="mt-2"
        value={simulation.currentSimulation?.simName || ""}
        onChange={(e) => simulation.updateSimulationName(e.target.value)}
      />
    </div>
  );
}