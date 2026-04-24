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
  updateIonConcentration: (concentration: number) => void;
  updateEquilibriation: (equilibriation: EquilibrationOptions) => void;
  updateVerification: (
    field: "temperature" | "pressure" | "system_volume",
    value: boolean,
  ) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}

export const SimulationContext = createContext<SimulationContextType | undefined>(undefined);