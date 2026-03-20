import { Input } from "@/components/ui/input";
import { useSimulation } from "@/contexts/SimulationContext";
import { STEP_CONFIG } from "@/constants/simulation.constants";

export default function StepOne() {
  const simulation = useSimulation();
  const { title, description } = STEP_CONFIG[1];

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <Input
        placeholder="eg. PHYS 3245 Midterm Simulation"
        className="mt-2"
        value={simulation.currentSimulation?.simName || ""}
        onChange={(e) => simulation.updateSimulationName(e.target.value)}
      />
    </div>
  );
}