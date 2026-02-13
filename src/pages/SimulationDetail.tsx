import { NavBar } from "@/components/shared/nav-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router";

export default function SimulationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch simulation data from backend using the id
  const simulation = {
    id: id,
    name: "PHYS4325 Midterm Simulation 1",
    proteinName: "collagen",
    proteinID: "XX103",
    status: "complete",
    timestamp: "date",
  };

  return (
    <main>
      <NavBar />

      <div className="flex flex-col items-start p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft />
          Back
        </Button>

        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">{simulation.name}</h1>
          <h1 className="text-xl">{simulation.proteinName}</h1>
          <h2 className="text-lg">PDB ID: {simulation.proteinID}</h2>
          <h3 className="mt-2">Ran on {simulation.timestamp}</h3>
        </div>
      </div>
    </main>
  );
}
