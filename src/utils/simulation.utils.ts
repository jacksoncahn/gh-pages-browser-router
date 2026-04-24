import type { ProteinMetadata, Simulation, SimulationDraft } from "@/types/simulation.types";

const SIMULATIONS_KEY = 'gromacs-simulations';

// STORAGE UTILITIES

export const getAllSimulations = (): Simulation[] => {
  try {
    const stored = localStorage.getItem(SIMULATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load simulations from localStorage:', error);
    return [];
  }
};

export const getSimulationById = (id: number): Simulation | null => {
  const simulations = getAllSimulations();
  return simulations.find(sim => sim.id === id) || null;
};

export const saveSimulation = (simulation: Simulation): void => {
  try {
    const simulations = getAllSimulations();
    const existingIndex = simulations.findIndex(sim => sim.id === simulation.id);

    if (existingIndex >= 0) {
      simulations[existingIndex] = simulation;
    } else {
      simulations.push(simulation);
    }

    localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(simulations));
  } catch (error) {
    console.error('Failed to save simulation to localStorage:', error);
  }
};

export const deleteSimulation = (id: number): void => {
  try {
    const simulations = getAllSimulations();
    const filtered = simulations.filter(sim => sim.id !== id);
    localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete simulation from localStorage:', error);
  }
};

export const generateSimulationId = (): number => {
  const simulations = getAllSimulations();
  if (simulations.length === 0) return 1;
  return Math.max(...simulations.map(sim => sim.id)) + 1;
};

// VALIDATION UTILITIES

/**
 * Validation rules for each step
 * Returns true if the step has all required fields filled
 */
export const validateStep = (
  step: number,
  simulation: SimulationDraft | null
): boolean => {
  if (!simulation) return false;

  const params = simulation.simulation_params;

  switch (step) {
    case 0:
      return Boolean(simulation.simName && simulation.simName.trim().length > 0);
    case 1:
      return !!params?.gromacsVersion;
    case 2:
      return !!params?.proteinId?.trim() && !!params?.proteinMetadata;
    case 3:
      return !!params?.forceField && !!params?.waterModel;
    case 4:
      return !!params?.boxDistance && !!params?.boxType;
    case 5:
      return !!params?.positiveIon && !!params?.negativeIon && !!params?.solventGroup;
    case 6:
      return true;
    case 7:
      return !!params?.equilibriationOptions;
    case 8:
    case 9:
    case 10:
      return true;
    default:
      return false;
  }
};



/**
 * Validate PDB ID format
 * Format: 4 characters, first is digit, rest are alphanumeric
 */
export const isValidPDBId = (pdbId: string): boolean => {
  if (!pdbId) return false;
  const pdbPattern = /^[0-9][A-Za-z0-9]{3}$/;
  return pdbPattern.test(pdbId.trim());
};

// PDB LOOKUP UTILITIES

/**
 * Handle PDB lookup logic - fetches metadata and updates simulation state
 * Returns object with status and error for state management in hooks
 */
export const handlePDBLookupLogic = async (
  proteinId: string,
  updateProteinMetadata: (metadata: ProteinMetadata | null) => void,
): Promise<{ status: "success" | "not_found" | "error"; error: string | null }> => {
  try {
    const { fetchPDBMetadata } = await import("@/services/rscb");
    const result = await fetchPDBMetadata(proteinId);

    if (result.status === "success" && result.data) {
      updateProteinMetadata(result.data);
      return { status: "success", error: null };
    } else if (result.status === "not_found") {
      updateProteinMetadata(null);
      return {
        status: "not_found",
        error: `No metadata found for PDB ID ${proteinId}`,
      };
    } else if (result.status === "error") {
      updateProteinMetadata(null);
      return { status: "error", error: result.message };
    }
  } catch (error) {
    updateProteinMetadata(null);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }

  return { status: "error", error: "Unknown error occurred" };
};
