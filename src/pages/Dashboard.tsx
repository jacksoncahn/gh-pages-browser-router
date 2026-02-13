import { SimulationCard } from "@/components/dashboard/simulation-card";
import { NavBar } from "@/components/shared/nav-bar";
import type { Simulation } from "@/types/simulation.types";

export default function Dashboard() {
  const sim1: Simulation = {
    id: 1,
    name: "collagen",
    proteinID: "XX103",
    status: "running",
  };
  const sim2: Simulation = {
    id: 2,
    name: "haemoglobin",
    proteinID: "XX132",
    status: "complete",
  };
  const sim3: Simulation = {
    id: 3,
    name: "haemoglobin",
    proteinID: "XX132",
    status: "complete",
  };
  const sim4: Simulation = {
    id: 4,
    name: "haemoglobin",
    proteinID: "XX132",
    status: "complete",
  };

  const simulations = [sim1, sim2, sim3, sim4];

  return (
    <main>
      <NavBar />
      <div className="p-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 flex">My Simulations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} simulation={sim} status={sim.status} />
          ))}
        </div>
      </div>
    </main>
  );
}
