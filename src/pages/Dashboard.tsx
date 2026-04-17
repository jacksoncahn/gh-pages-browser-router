import { SimulationCard } from "@/components/dashboard/simulation-card";
import { NavBar } from "@/components/shared/nav-bar";
import type { Simulation } from "@/types/simulation.types";
import { getAllSimulations } from "@/utils/simulation.utils";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    const loadedSimulations = getAllSimulations();
    setSimulations(loadedSimulations);
  }, []);

  return (
    <main className="py-4">
      <NavBar />
      <div className="p-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 flex">My Simulations</h1>
        {simulations.length === 0 ? (
          <p className="text-muted-foreground">
            No simulations yet. Create your first simulation to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {simulations.map((sim) => (
              <SimulationCard
                key={sim.id}
                simulation={{
                  id: sim.id,
                  name: sim.simName,
                  proteinID: sim.simulation_params?.proteinId || "Unknown",
                  status: sim.status,
                }}
                status={sim.status}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
