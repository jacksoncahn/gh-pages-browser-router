import { z } from "zod"

export type Simulation = {
  id: number
  simName: string
  created_at: string
  updated_at: string
  simulation_params: SimulationParams
  status: 'paused' | 'running' | 'complete' | 'unknown'
}

export type SimulationParams = {
  //TODO: flesh this out with actual simulation type once that is firmed up
  proteinId: string
  forceField: ForceField
  waterModel: WaterModel
  boxType: BoxType
  boxDistance: number
  positiveIon: PositiveIonType
  negativeIon: NegativeIonType
  ion_concentration: number
  minimizationParams: MinimizationParams
  equilibriationParams: EquilibrationParams
  verificationParams: VerificationParams
}

/* SIMULATION COMPONENTS */

/* FORCE FIELDS */
export const ForceFields = {
  // GROMACS supported AMBER force fields
  AMBER94: "AMBER94",
  AMBER96: "AMBER96",
  AMBER99: "AMBER99",
  AMBER99SB: "AMBER99SB",
  AMBER99SB_ILDN: "AMBER99SB-ILDN",
  AMBER03: "AMBER03",
  AMBER14SB: "AMBER14SB",
  AMBER19SB: "AMBER19SB",
  AMBERGS: "AMBERGS",

  // only officially GROMACS supported CHARMM force field
  CHARMM27: "CHARMM27",

  // GROMACS supported OPLS force fields 
  OPLS_AA_M: "OPLS-AA/M",
} as const

export const ForceField = z.union([
  z.literal(ForceFields.AMBER94),
  z.literal(ForceFields.AMBER96),
  z.literal(ForceFields.AMBER99),
  z.literal(ForceFields.AMBER99SB),
  z.literal(ForceFields.AMBER99SB_ILDN),
  z.literal(ForceFields.AMBER03),
  z.literal(ForceFields.AMBER14SB),
  z.literal(ForceFields.AMBER19SB),
  z.literal(ForceFields.AMBERGS),
  z.literal(ForceFields.CHARMM27),
  z.literal(ForceFields.OPLS_AA_M)
])

export type ForceField = z.infer<typeof ForceField>

/* WATER MODELS */
export const WaterModels = {
  SPC216: "SPC216",
  TIP3P: "TIP3P",
  TIP4P: "TIP4P",
  TIP4P_EW: "TIP4P-Ew",
  TIP5P: "TIP5P",
  None: "None",
  //TODO: add other supported water models
} as const

export const WaterModel = z.union([
  z.literal(WaterModels.SPC216),
  z.literal(WaterModels.TIP3P),
  z.literal(WaterModels.TIP4P),
  z.literal(WaterModels.TIP4P_EW),
  z.literal(WaterModels.TIP5P),
  z.literal(WaterModels.None)
])

export type WaterModel = z.infer<typeof WaterModel>

/* BOX TYPES */
export const BoxTypes = {
  Cubic: "cubic",
  Triclinic: "triclinic",
  Octahedran: "octahedran",
  Dodecahedran: "dodecahedron",
} as const

export const BoxType = z.union([
  z.literal(BoxTypes.Cubic),
  z.literal(BoxTypes.Triclinic),
  z.literal(BoxTypes.Octahedran),
  z.literal(BoxTypes.Dodecahedran)
])

export type BoxType = z.infer<typeof BoxType>

/* ION TYPES */
export const PositiveIonTypes = {
  Na: "NA",
  //TODO: add other supported positive ion types
} as const

export const PositiveIonType = z.union([
  z.literal(PositiveIonTypes.Na)
])

export type PositiveIonType = z.infer<typeof PositiveIonType>

export const NegativeIonTypes = {
  Cl: "CL",
  //TODO: add other supported negative ion types
} as const

export const NegativeIonType = z.union([
  z.literal(NegativeIonTypes.Cl)
])

export type NegativeIonType = z.infer<typeof NegativeIonType>

/* SOLVENT GROUPS */
//TODO: add supported solvent groups slash check on if these are consistent across the board

/* MINIMIZATION */
// TODO: need all parameter options for minimization
export type MinimizationParams = {
  integrator: Integrator
  dt: number
  nsteps: number
  nstlog: number
  nstenergy: number
  nstxout_compressed: number
  continuation: "yes" | "no"
  constraints: Constraint
  constraint_algorithm: ConstraintAlgorithm
  cutoff_scheme: CutoffScheme
  coulombtype: CoulombType
  rcoulomb: number
  vdwtype: VDWType
  rvdw: number
  DispCorr: "no" | "EnerPres" | "Ener"
  tcoupl: TCoupl
  tc_grps: string //Protein  SOL // TODO: need to check on how this is formatted and what the options are for this
  tau_t: [number, number]
  ref_t: [number, number]
  pcoupl: PCoupl
  tau_p: number
  compressibility: number
  ref_p: number
}

/** INTEGRATORS **/
export const Integrators = {
  steep: "steep",
  md: "md",
  cg: "conjugate gradient",
  bd: "bd",
  lbfgs: "lbfgs"
} as const

export const Integrator = z.union([
  z.literal(Integrators.steep),
  z.literal(Integrators.md),
  z.literal(Integrators.lbfgs),
  z.literal(Integrators.cg),
  z.literal(Integrators.bd)
])

export type Integrator = z.infer<typeof Integrator>

/** CONSTRAINTS **/
export const Constraints = {
  none: "none",
  all_bonds: "all-bonds",
  h_bonds: "h-bonds",
} as const

export const Constraint = z.union([
  z.literal(Constraints.none),
  z.literal(Constraints.all_bonds),
  z.literal(Constraints.h_bonds)
])

export type Constraint = z.infer<typeof Constraint>

/** CONSTRAINT ALGORITHMS **/
export const ConstraintAlgorithms = {
  lincs: "lincs",
  shake: "shake",
  settle: "settle"
} as const

export const ConstraintAlgorithm = z.union([
  z.literal(ConstraintAlgorithms.lincs),
  z.literal(ConstraintAlgorithms.shake),
  z.literal(ConstraintAlgorithms.settle)
])

export type ConstraintAlgorithm = z.infer<typeof ConstraintAlgorithm>

/** CUTOFF SCHEMES **/
export const CutoffSchemes = {
  verlet: "Verlet",
} as const

export const CutoffScheme = z.union([
  z.literal(CutoffSchemes.verlet)
])

export type CutoffScheme = z.infer<typeof CutoffScheme>

/** COULOMB TYPES **/
export const CoulombTypes = {
  Cutoff: "Cut-off",
  Ewald: "Ewald",
  PME: "PME",
  P3M_AD: "P3M-AD",
  ReactionField: "Reaction-field"
} as const

export const CoulombType = z.union([
  z.literal(CoulombTypes.Cutoff),
  z.literal(CoulombTypes.Ewald),
  z.literal(CoulombTypes.PME),
  z.literal(CoulombTypes.P3M_AD),
  z.literal(CoulombTypes.ReactionField)
])

export type CoulombType = z.infer<typeof CoulombType>

/** VAN DER WAALS **/
export const VDWTypes = {
  Cutoff: "Cut-off",
  PME: "PME",
  Shift: "Shift",
  Switch: "Switch"
} as const

export const VDWType = z.union([
  z.literal(VDWTypes.Cutoff),
  z.literal(VDWTypes.PME),
  z.literal(VDWTypes.Shift),
  z.literal(VDWTypes.Switch)
])

export type VDWType = z.infer<typeof VDWType>

/** TEMPERATURE COUPLING */
export const TCouplOptions = {
  no: "no",
  berendsen: "berendsen",
  nose_hoover: "nose-hoover",
  v_rescale: "v-rescale",
} as const

export const TCoupl = z.union([
  z.literal(TCouplOptions.no),
  z.literal(TCouplOptions.berendsen),
  z.literal(TCouplOptions.nose_hoover),
  z.literal(TCouplOptions.v_rescale)
])

export type TCoupl = z.infer<typeof TCoupl>

/** PRESSURE COUPLING */
export const PCouplOptions = {
  no: "no",
  berendsen: "berendsen",
  c_rescale: "C-rescale",
  Parrinello_Rahman: "Parrinello-Rahman"
} as const

export const PCoupl = z.union([
  z.literal(PCouplOptions.no),
  z.literal(PCouplOptions.berendsen),
  z.literal(PCouplOptions.c_rescale),
  z.literal(PCouplOptions.Parrinello_Rahman)
])

export type PCoupl = z.infer<typeof PCoupl>

export type EquilibrationParams = {
  //TODO: need all parameter options for equilibration
  integrator: Integrator
  dt: number
  nsteps: number
}

export type VerificationParams = {
  //TODO: need all parameter options for verification
  temperature: boolean
  pressure: boolean
  system_volume: boolean
}