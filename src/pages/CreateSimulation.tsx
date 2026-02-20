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
      <main className="h-screen flex flex-col max-h-100%">
        <NavBar />
        <CreationStepProgress step={currentStep} totalSteps={totalSteps} />
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div className="w-full max-w-4xl h-full flex items-center justify-center">
            <Outlet />
          </div>
        </div>
      </main>
    </SimulationProvider>
  );
}
