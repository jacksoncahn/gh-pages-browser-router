import { NavBar } from "@/components/shared/nav-bar";
import { Outlet, useParams, useNavigate } from "react-router";
import { CreationStepProgress } from "@/components/simulation/step-progress";
import { useEffect } from "react";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { Button } from "@/components/ui/button";
import { useSimulationLogic } from "@/hooks/useSimulationLogic";
import { TOTAL_STEPS } from "@/constants/simulation.constants";
import { AppFooter } from "@/components/shared/app-footer";

function NavigationButtons() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = stepNumber ? parseInt(stepNumber) : 0;

  const { isCurrentStepValid, handleNext, handlePrevious } = useSimulationLogic(
    currentStep,
    TOTAL_STEPS,
    navigate,
  );

  return (
    <div className="shrink-0 border-t border-b pt-4 px-4 pb-4 flex justify-between">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
      >
        Previous
      </Button>
      <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
        {currentStep === TOTAL_STEPS - 1 ? "Finish" : "Next"}
      </Button>
    </div>
  );
}

export default function CreateSimulation() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = stepNumber ? parseInt(stepNumber) : 0;

  useEffect(() => {
    if (!stepNumber) {
      navigate("/simulation/new/0", { replace: true });
    }
  }, [stepNumber, navigate]);

  return (
    <SimulationProvider>
      <main className="h-dvh flex flex-col overflow-hidden py-4">
        <NavBar showButton={false} />

        <div className="shrink-0 px-4 pb-4">
          <CreationStepProgress step={currentStep + 1} totalSteps={TOTAL_STEPS} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4">
          <div className="min-h-full flex items-center justify-center">
            <Outlet />
          </div>
        </div>

        <NavigationButtons />
        <AppFooter />
      </main>
    </SimulationProvider>
  );
}
