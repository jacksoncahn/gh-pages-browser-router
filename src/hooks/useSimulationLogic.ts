import { useNavigate } from "react-router";
import { useSimulation } from "@/hooks/useSimulation";
import { validateStep } from "@/utils/simulation.utils";

import { useState } from "react";
import { fetchPDBMetadata } from "@/services/rscb";
import { isValidPDBId } from "@/utils/simulation.utils";

/**
 * Custom hook for managing SimulationStep logic
 * Handles navigation, validation, and step transitions
 */
export const useSimulationLogic = (
  currentStep: number,
  totalSteps: number,
  navigate: ReturnType<typeof useNavigate>
) => {
  const simulation = useSimulation();

  /**
   * Validates the current step has all required fields filled
   */
  const isCurrentStepValid = (): boolean => {
    if (!simulation.currentSimulation) {
      return false;
    }
    return validateStep(currentStep, simulation.currentSimulation);
  };

  /**
   * Navigate to next step or complete simulation
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      navigate(`/simulation/new/${currentStep + 1}`);
    } else {
      // Save simulation and go to dashboard
      simulation.completeSimulation();
      navigate("/dashboard");
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      navigate(`/simulation/new/${currentStep - 1}`);
    }
  };

  type LookupStatus = "idle" | "loading" | "success" | "not_found" | "error";

  /**
   * Custom hook for PDB metadata lookup
   * Handles validation, fetching, and error states
   */
  const usePDBLookup = () => {
    const simulation = useSimulation();
    const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
    const [lookupError, setLookupError] = useState<string | null>(null);

    const handlePDBLookup = async () => {
      const params = simulation.currentSimulation?.simulation_params;
      const proteinId = (params?.proteinId || "").trim().toUpperCase();

      // Validate PDB ID format
      if (!isValidPDBId(proteinId)) {
        setLookupError(
          "Invalid PDB ID format. Should be 4 characters (e.g., 1AKI, 108D)."
        );
        setLookupStatus("error");
        return;
      }

      setLookupStatus("loading");
      setLookupError(null);

      // Fetch metadata from RSCB API
      const result = await fetchPDBMetadata(proteinId);

      // Handle response
      if (result.status === "success" && result.data) {
        simulation.updateProteinMetadata(result.data);
        setLookupStatus("success");
      } else if (result.status === "not_found") {
        simulation.updateProteinMetadata(null);
        setLookupError(`No metadata found for PDB ID ${proteinId}`);
        setLookupStatus("not_found");
      } else if (result.status === "error") {
        simulation.updateProteinMetadata(null);
        setLookupError(result.message);
        setLookupStatus("error");
      }
    };

    return { lookupStatus, lookupError, handlePDBLookup };
  };

  return {
    isCurrentStepValid,
    handleNext,
    handlePrevious,
    usePDBLookup,
  };
};