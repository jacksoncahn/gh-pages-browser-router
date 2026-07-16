import { type ReactNode, useEffect, useState } from "react";
import { SimulationContext } from "@/contexts/SimulationContext";
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
  const updateIonConcentration = (concentration: number | null) =>
    updateSimulationParam("ionConcentration", concentration);
  const updateNeutralizeSystem = (neutralize: boolean) =>
    updateSimulationParam("neutralizeSystem", neutralize);
  const updateUseGpu = (useGpu: boolean) =>
    updateSimulationParam("useGpu", useGpu);
  const updateEquilibration = (equilibration: EquilibrationOptions) =>
    updateSimulationParam("equilibrationOptions", equilibration);
  const updateEnableMaxIonsWarning = (enabled: boolean) =>
    updateSimulationParam("enableMaxIonsWarning", enabled);
  const updateIonMaxWarnings = (maxIonWarnings: number | null) =>
    updateSimulationParam("maxIonWarnings", maxIonWarnings);
  const updateEnableMaxMinimizationWarning = (enabled: boolean) =>
    updateSimulationParam("enableMaxMinimizationWarning", enabled);
  const updateMinimizationMaxWarnings = (maxWarnings: number | null) =>
    updateSimulationParam("maxMinimizationWarnings", maxWarnings);
  const updateEnableMaxEquilibrationWarning = (enabled: boolean) =>
    updateSimulationParam("enableMaxEquilibrationWarning", enabled);
  const updateMaxEquilibrationWarnings = (maxWarnings: number | null) =>
    updateSimulationParam("maxEquilibrationWarnings", maxWarnings);
  const updateEnableRunSimulationWarning = (enabled: boolean) =>
    updateSimulationParam("enableRunSimulationWarning", enabled);
  const updateMaxRunSimulationWarnings = (maxWarnings: number | null) =>
    updateSimulationParam("maxRunSimulationWarnings", maxWarnings);

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

  const completeSimulation = () => {
    const sim = currentSimulation;
    if (!sim?.simName || !sim.simulation_params) return;

    const completedSim: Simulation = {
      id: sim.id ?? generateSimulationId(),
      simName: sim.simName,
      created_at: sim.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      simulation_params:
        sim.simulation_params as Simulation["simulation_params"],
      status: "complete",
    };

    saveSimulation(completedSim);
    sessionStorage.removeItem("simulation-draft");
    setCurrentSimulation(createInitialSimulation());
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
        updateNeutralizeSystem,
        updateUseGpu,
        updateEquilibration,
        updateVerification,
        updateEnableMaxIonsWarning,
        updateIonMaxWarnings,
        updateEnableMaxMinimizationWarning,
        updateMinimizationMaxWarnings,
        updateEnableMaxEquilibrationWarning,
        updateMaxEquilibrationWarnings,
        updateEnableRunSimulationWarning,
        updateMaxRunSimulationWarnings,
        completeSimulation,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
