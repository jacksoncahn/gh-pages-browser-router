import { NavBar } from "@/components/shared/nav-bar";
import { Outlet, useParams, useNavigate } from "react-router";
import { CreationStepProgress } from "@/components/simulation/step-progress";
import { useEffect } from "react";
import { SimulationProvider } from "@/contexts/SimulationContext";

export default function CreateSimulation() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const totalSteps = 9;
  const currentStep = stepNumber ? parseInt(stepNumber) : 1;

  // Redirect to step 1 if no step is specified
  useEffect(() => {
    if (!stepNumber) {
      navigate("/simulation/new/1", { replace: true });
    }
  }, [stepNumber, navigate]);

  return (
    <SimulationProvider>
      <main className="h-dvh flex flex-col overflow-hidden">
        <NavBar />
        <CreationStepProgress step={currentStep} totalSteps={totalSteps} />
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="w-full max-w-4xl h-full min-h-0 mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </SimulationProvider>
  );
}
