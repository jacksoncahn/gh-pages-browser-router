interface StepProgressProps {
  step: number;
  totalSteps: number;
}

export function CreationStepProgress({ step, totalSteps }: StepProgressProps) {
  return (
    <div
      className="w-full flex gap-2"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={`Step ${step} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index < step;
        return (
          <div
            key={index}
            className={`flex-1 h-4 rounded-full ${
              isActive ? "bg-primary" : "bg-muted"
            }`}
          ></div>
        )
      })}

      <p className="font-semibold text-lg text-center">
        Step {step} / {totalSteps}
      </p>
    </div>
  );
}
