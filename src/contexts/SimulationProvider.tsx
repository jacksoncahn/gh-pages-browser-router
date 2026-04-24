import { type ReactNode, useEffect, useState } from "react";
import {
  SimulationContext,
} from "@/contexts/SimulationContext";
import { type SimulationDraft } from "@/types/simulation.types";
import type {
  SimulationParams,
  ForceField,
  WaterModel,
  BoxType,
  PositiveIonType,
  NegativeIonType,
  EquilibrationOptions,
  ProteinMetadata,
  SolventGroup,
  Simulation,
} from "@/types/simulation.types";
import { generateSimulationId, saveSimulation } from "@/utils/simulation.utils";

const createInitialSimulation = (): SimulationDraft => ({
  simName: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  simulation_params: null,
  status: "unknown",
});

function loadInitialSimulation(): SimulationDraft {
  const fallback = createInitialSimulation();
  if (typeof window === "undefined") return fallback;

  const savedDraft = sessionStorage.getItem("simulation-draft");
  if (!savedDraft) return fallback;

  try {
    return JSON.parse(savedDraft) as SimulationDraft;
  } catch (error) {
    console.error("Failed to load draft simulation:", error);
    return fallback;
  }
}

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [currentSimulation, setCurrentSimulation] =
    useState<SimulationDraft | null>(() => loadInitialSimulation());

  // Load in-progress simulation from sessionStorage on mount
  useEffect(() => {
    if (!currentSimulation) return;
    sessionStorage.setItem(
      "simulation-draft",
      JSON.stringify(currentSimulation),
    );
  }, [currentSimulation]);

  const updateSimulation = (updates: Partial<SimulationDraft>) => {
    setCurrentSimulation((prev) => ({
      ...(prev ?? createInitialSimulation()),
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateSimulationParam = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K],
  ) => {
    setCurrentSimulation((prev) => {
      const base = prev ?? createInitialSimulation();
      const params = base.simulation_params ?? {};

      return {
        ...base,
        simulation_params: {
          ...params,
          [key]: value,
        },
        updated_at: new Date().toISOString(),
      };
    });
  };

  // // Save to sessionStorage whenever simulation changes
  // useEffect(() => {
  //   if (currentSimulation) {
  //     sessionStorage.setItem(
  //       "simulation-draft",
  //       JSON.stringify(currentSimulation),
  //     );
  //   }
  // }, [currentSimulation]);

  // const updateSimulation = (updates: Partial<Simulation>) => {
  //   setCurrentSimulation((prev) => ({
  //     ...prev,
  //     ...updates,
  //     updated_at: new Date().toISOString(),
  //   }));
  // };

  // const updateSimulationParams = (paramUpdates: Partial<SimulationParams>) => {
  //   setCurrentSimulation((prev) => ({
  //     ...prev,
  //     simulation_params: {
  //       ...prev?.simulation_params,
  //       ...paramUpdates,
  //     } as SimulationParams,
  //     updated_at: new Date().toISOString(),
  //   }));
  // };

  // const updateGromacsVersion = (version: string) => {
  //   updateSimulationParams({ gromacsVersion: version });
  // };

  // const updateSimulationName = (name: string) => {
  //   updateSimulation({ simName: name });
  // };

  // const updateProteinId = (proteinId: string) => {
  //   updateSimulationParams({ proteinId });
  // };

  // const updateCleanProtein = (cleanProtein: boolean) => {
  //   updateSimulationParams({ cleanProtein });
  // };

  // const updateProteinMetadata = (metadata: ProteinMetadata | null) => {
  //   updateSimulationParams({ proteinMetadata: metadata });
  // };

  // const updateForceField = (forceField: ForceField) => {
  //   updateSimulationParams({ forceField });
  // };

  // const updateWaterModel = (waterModel: WaterModel) => {
  //   updateSimulationParams({ waterModel });
  // };

  // const updateBoxDistance = (distance: number) => {
  //   updateSimulationParams({ boxDistance: distance });
  // };

  // const updateBoxType = (boxType: BoxType) => {
  //   updateSimulationParams({ boxType });
  // };

  // const updatePositiveIon = (ion: PositiveIonType) => {
  //   updateSimulationParams({ positiveIon: ion });
  // };

  // const updateNegativeIon = (ion: NegativeIonType) => {
  //   updateSimulationParams({ negativeIon: ion });
  // };

  // const updateSolventGroup = (group: string) => {
  //   updateSimulationParams({ solventGroup: group } as any);
  // };

  // const updateIonConcentration = (concentration: number) => {
  //   updateSimulationParams({ ion_concentration: concentration } as any);
  // };

  // const updateEquilibriation = (
  //   equilibriation: "none" | "nvt" | "npt" | "both",
  // ) => {
  //   updateSimulationParams({ equilibriationOptions: equilibriation } as any);
  // };

  // const updateVerification = (
  //   field: "temperature" | "pressure" | "system_volume",
  //   value: boolean,
  // ) => {
  //   setCurrentSimulation((prev) => ({
  //     ...prev,
  //     simulation_params: {
  //       ...prev?.simulation_params,
  //       verificationParams: {
  //         ...prev?.simulation_params?.verificationParams,
  //         [field]: value,
  //       },
  //     } as SimulationParams,
  //     updated_at: new Date().toISOString(),
  //   }));
  // };

  // const completeSimulation = () => {
  //   if (currentSimulation && currentSimulation.simName) {
  //     const completedSim: Simulation = {
  //       ...currentSimulation,
  //       id: generateSimulationId(),
  //       status: "complete",
  //       updated_at: new Date().toISOString(),
  //     } as Simulation;

  //     saveSimulation(completedSim);
  //     sessionStorage.removeItem("simulation-draft");
  //     setCurrentSimulation(createInitialSimulation());
  //   }
  // };

  // const resetSimulation = () => {
  //   sessionStorage.removeItem("simulation-draft");
  //   setCurrentSimulation(createInitialSimulation());
  // };
  const updateGromacsVersion = (version: string) =>
    updateSimulationParam(
      "gromacsVersion",
      version as SimulationParams["gromacsVersion"],
    );
  const updateSimulationName = (name: string) =>
    updateSimulation({ simName: name });
  const updateProteinId = (proteinId: string) =>
    updateSimulationParam("proteinId", proteinId);
  const updateCleanProtein = (cleanProtein: boolean) =>
    updateSimulationParam("cleanProtein", cleanProtein);
  const updateProteinMetadata = (metadata: ProteinMetadata | null) =>
    updateSimulationParam("proteinMetadata", metadata);
  const updateForceField = (forceField: ForceField) =>
    updateSimulationParam("forceField", forceField);
  const updateWaterModel = (waterModel: WaterModel) =>
    updateSimulationParam("waterModel", waterModel);
  const updateBoxDistance = (distance: number) =>
    updateSimulationParam("boxDistance", distance);
  const updateBoxType = (boxType: BoxType) =>
    updateSimulationParam("boxType", boxType);
  const updatePositiveIon = (ion: PositiveIonType) =>
    updateSimulationParam("positiveIon", ion);
  const updateNegativeIon = (ion: NegativeIonType) =>
    updateSimulationParam("negativeIon", ion);
  const updateSolventGroup = (group: SolventGroup) =>
    updateSimulationParam("solventGroup", group);
  const updateIonConcentration = (concentration: number) =>
    updateSimulationParam("ion_concentration", concentration);
  const updateEquilibriation = (equilibriation: EquilibrationOptions) =>
    updateSimulationParam("equilibriationOptions", equilibriation);

  const updateVerification = (
    field: "temperature" | "pressure" | "system_volume",
    value: boolean,
  ) => {
    setCurrentSimulation((prev) => {
      const base = prev ?? createInitialSimulation();
      const params = base.simulation_params ?? {};

      return {
        ...base,
        simulation_params: {
          ...params,
          verificationParams: {
            ...(params.verificationParams ?? {
              temperature: false,
              pressure: false,
              system_volume: false,
            }),
            [field]: value,
          },
        },
        updated_at: new Date().toISOString(),
      };
    });
  };

  // const completeSimulation = () => updateSimulation({ status: "complete" });
  // const resetSimulation = () => setCurrentSimulation(createInitialSimulation());

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
