import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useSimulationLogic } from "@/hooks/useSimulationLogic";
import { TOTAL_STEPS } from "@/constants/simulation.constants";

// Import all step components
import StepZero from "./steps/StepZero";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import StepFive from "./steps/StepFive";
import StepSix from "./steps/StepSix";
import StepSeven from "./steps/StepSeven";
import StepEight from "./steps/StepEight";
import StepNine from "./steps/StepNine";

/**
 * Array of step components mapped by step number (1-9)
 */
const STEP_COMPONENTS = [
  StepZero,
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
  StepSeven,
  StepEight,
  StepNine,
];

/**
 * SimulationStep: Main router component for the 9-step simulation wizard
 * Routes to the appropriate step component based on the URL parameter
 * Handles navigation and validation through the custom hook
 */
export default function SimulationStep() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(stepNumber || "0");

  // Use custom hook for step logic, validation, and navigation
  const { isCurrentStepValid, handleNext, handlePrevious } = useSimulationLogic(
    currentStep,
    TOTAL_STEPS,
    navigate,
  );

  // Get the appropriate step component
  const StepComponent = STEP_COMPONENTS[currentStep];

  // Handle invalid step
  if (!StepComponent) {
    return <div className="text-center py-8">Invalid step</div>;
  }

  return (
    <div className="flex flex-col p-4 md:p-6 px-[6%] md:px-[10%] w-full h-full min-h-0 overflow-hidden">
      {/* Main step content area */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-y-auto">
        <div className="w-full">
          <StepComponent />
        </div>
      </div>

      {/* Navigation footer */}
      <div className="shrink-0 flex justify-between border-t pt-4 w-full">
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
    </div>
  );
}
