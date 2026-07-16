import { createContext } from "react";
import type {
  SimulationDraft,
  ForceField,
  WaterModel,
  BoxType,
  PositiveIonType,
  NegativeIonType,
  EquilibrationOptions,
  ProteinMetadata,
  SolventGroup,
} from "@/types/simulation.types";

interface SimulationContextType {
  currentSimulation: SimulationDraft | null;
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
  updateSolventGroup: (group: SolventGroup) => void;
  updateIonConcentration: (concentration: number | null) => void;
  updateNeutralizeSystem: (neutralize: boolean) => void;
  updateUseGpu: (useGpu: boolean) => void;
  updateEquilibriation: (equilibriation: EquilibrationOptions) => void;
  updateVerification: (
    field: "temperature" | "pressure" | "system_volume",
    value: boolean,
  ) => void;
  updateEnableMaxIonsWarning: (enabled: boolean) => void;
  updateIonMaxWarnings: (maxIonWarnings: number | null) => void;
  updateEnableMaxMinimizationWarning: (enabled: boolean) => void;
  updateMinimizationMaxWarnings: (maxWarnings: number | null) => void;
  updateEnableMaxEquilibrationWarning: (enabled: boolean) => void;
  updateMaxEquilibrationWarnings: (maxWarnings: number | null) => void;
  updateEnableRunSimulationWarning: (enabled: boolean) => void;
  updateMaxRunSimulationWarnings: (maxWarnings: number | null) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}

export const SimulationContext = createContext<SimulationContextType | undefined>(undefined);