import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Simulation,
  SimulationParams,
  ForceField,
  WaterModel,
  BoxType,
  PositiveIonType,
  NegativeIonType,
  EquilibrationOptions,
  ProteinMetadata,
} from "@/types/simulation.types";
import { saveSimulation, generateSimulationId } from "@/utils/simulation.utils";

interface SimulationContextType {
  currentSimulation: Partial<Simulation> | null;
  updateGromacsVersion: (version: string) => void;
  updateSimulationName: (name: string) => void;
  updateProteinId: (proteinId: string) => void;
  updateCleanProtein: (cleanProtein: boolean) => void;
  updateProteinMetadata: (metadata: ProteinMetadata | null) => void;
  updateForceField: (forceField: ForceField) => void;
  updateWaterModel: (waterModel: WaterModel) => void;
  updateBoxDistance: (distance: number) => void;
  updateBoxType: (boxType: BoxType) => void;
  updatePositiveIon: (ion: PositiveIonType) => void;
  updateNegativeIon: (ion: NegativeIonType) => void;
  updateSolventGroup: (group: string) => void;
  updateIonConcentration: (concentration: number) => void;
  updateEquilibriation: (equilibriation: EquilibrationOptions) => void;
  updateVerification: (
    field: "temperature" | "pressure" | "system_volume",
    value: boolean,
  ) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined,
);

const createInitialSimulation = (): Partial<Simulation> => ({
  simName: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  simulation_params: {
    proteinId: "",
    boxDistance: "",
    solventGroup: "",
    ion_concentration: 0,
    verificationParams: {
      temperature: false,
      pressure: false,
      system_volume: false,
    },
  } as any,
  status: "unknown",
});

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [currentSimulation, setCurrentSimulation] =
    useState<Partial<Simulation> | null>(createInitialSimulation);

  // Load in-progress simulation from sessionStorage on mount
  useEffect(() => {
    const savedDraft = sessionStorage.getItem("simulation-draft");
    if (savedDraft) {
      try {
        setCurrentSimulation(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to load draft simulation:", error);
      }
    }
  }, []);

  // Save to sessionStorage whenever simulation changes
  useEffect(() => {
    if (currentSimulation) {
      sessionStorage.setItem(
        "simulation-draft",
        JSON.stringify(currentSimulation),
      );
    }
  }, [currentSimulation]);

  const updateSimulation = (updates: Partial<Simulation>) => {
    setCurrentSimulation((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateSimulationParams = (paramUpdates: Partial<SimulationParams>) => {
    setCurrentSimulation((prev) => ({
      ...prev,
      simulation_params: {
        ...prev?.simulation_params,
        ...paramUpdates,
      } as SimulationParams,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateGromacsVersion = (version: string) => {
    updateSimulationParams({ gromacsVersion: version } as any);
  };

  const updateSimulationName = (name: string) => {
    updateSimulation({ simName: name });
  };

  const updateProteinId = (proteinId: string) => {
    updateSimulationParams({ proteinId });
  };

  const updateCleanProtein = (cleanProtein: boolean) => {
    updateSimulationParams({ cleanProtein } as any);
  }

  const updateProteinMetadata = (metadata: ProteinMetadata | null) => {
    updateSimulationParams({ proteinMetadata: metadata} as any);
  }

  const updateForceField = (forceField: ForceField) => {
    updateSimulationParams({ forceField });
  };

  const updateWaterModel = (waterModel: WaterModel) => {
    updateSimulationParams({ waterModel });
  };

  const updateBoxDistance = (distance: number) => {
    updateSimulationParams({ boxDistance: distance } as any);
  };

  const updateBoxType = (boxType: BoxType) => {
    updateSimulationParams({ boxType });
  };

  const updatePositiveIon = (ion: PositiveIonType) => {
    updateSimulationParams({ positiveIon: ion });
  };

  const updateNegativeIon = (ion: NegativeIonType) => {
    updateSimulationParams({ negativeIon: ion });
  };

  const updateSolventGroup = (group: string) => {
    updateSimulationParams({ solventGroup: group } as any);
  };

  const updateIonConcentration = (concentration: number) => {
    updateSimulationParams({ ion_concentration: concentration } as any);
  };

  const updateEquilibriation = (equilibriation: "none" | "nvt" | "npt" | "both") => {
    updateSimulationParams({ equilibriationOptions: equilibriation } as any);
  }

  const updateVerification = (
    field: "temperature" | "pressure" | "system_volume",
    value: boolean,
  ) => {
    setCurrentSimulation((prev) => ({
      ...prev,
      simulation_params: {
        ...prev?.simulation_params,
        verificationParams: {
          ...prev?.simulation_params?.verificationParams,
          [field]: value,
        },
      } as SimulationParams,
      updated_at: new Date().toISOString(),
    }));
  };

  const completeSimulation = () => {
    if (currentSimulation && currentSimulation.simName) {
      const completedSim: Simulation = {
        ...currentSimulation,
        id: generateSimulationId(),
        status: "complete",
        updated_at: new Date().toISOString(),
      } as Simulation;

      saveSimulation(completedSim);
      sessionStorage.removeItem("simulation-draft");
      setCurrentSimulation(createInitialSimulation());
    }
  };

  const resetSimulation = () => {
    sessionStorage.removeItem("simulation-draft");
    setCurrentSimulation(createInitialSimulation());
  };

  return (
    <SimulationContext.Provider
      value={{
        currentSimulation,
        updateGromacsVersion,
        updateSimulationName,
        updateProteinId,
        updateCleanProtein,
        updateProteinMetadata,
        updateForceField,
        updateWaterModel,
        updateBoxDistance,
        updateBoxType,
        updatePositiveIon,
        updateNegativeIon,
        updateSolventGroup,
        updateIonConcentration,
        updateEquilibriation,
        updateVerification,
        completeSimulation,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
