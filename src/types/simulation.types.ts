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
  gromacsVersion: GromacsVersion
  proteinId: string
  proteinMetadata?: ProteinMetadata
  cleanProtein: boolean
  forceField: ForceField
  waterModel: WaterModel
  boxType: BoxType
  boxDistance: number
  positiveIon: PositiveIonType
  negativeIon: NegativeIonType
  solventGroup: SolventGroup
  ion_concentration: number
  minimizationParams: MinimizationParams
  equilibriationOptions: EquilibrationOptions
  equilibriationParams?: EquilibrationParams
  verificationParams: VerificationParams
}

/* SIMULATION COMPONENTS */

/* GROMACS VERSIONS */
export const GromacsVersions = {
  gmx: "gmx",
  gmx_mpi: "gmx_mpi",
}

export type GromacsVersion = typeof GromacsVersions[keyof typeof GromacsVersions]

/* PROTEIN METADATA */
export type ProteinMetadata = {
  entryId: string
  deposited_atom_count: number | null
  experimental_method: string | null
  molecular_weight: number | null
  pdbx_database_id_DOI: string | null
  title: string | null
  pdbx_keywords: string[] 
  initial_release_date: string | null
  revision_date: string | null
}

/* FORCE FIELDS */
export const ForceFields = {
  // GROMACS supported AMBER force fields
  AMBER03: "amber03",
  AMBER94: "amber94",
  AMBER96: "amber96",
  AMBER99: "amber99",
  AMBER99SB: "amber99sb",
  AMBER99SB_ILDN: "amber99sb-ildn",
  AMBERGS: "ambergs",

  // only officially GROMACS supported CHARMM force field
  CHARMM27: "charmm27",

  // GROMOS forcefields
  GROMOS43A1: "gromos43a1",
  GROMOS43A2: "gromos43a2",
  GROMOS45A3: "gromos45a3",
  GROMOS53A5: "gromos53a5",
  GROMOS53A6: "gromos53a6",
  GROMOS54A7: "gromos54a7",

  // GROMACS supported OPLS force fields 
  OPLS_AA_L: "oplsaa",
} as const

export const ForceField = z.union([
  z.literal(ForceFields.AMBER94),
  z.literal(ForceFields.AMBER96),
  z.literal(ForceFields.AMBER99),
  z.literal(ForceFields.AMBER99SB),
  z.literal(ForceFields.AMBER99SB_ILDN),
  z.literal(ForceFields.AMBERGS),
  z.literal(ForceFields.CHARMM27),
  z.literal(ForceFields.GROMOS43A1),
  z.literal(ForceFields.GROMOS43A2),
  z.literal(ForceFields.GROMOS45A3),
  z.literal(ForceFields.GROMOS53A5),
  z.literal(ForceFields.GROMOS53A6),
  z.literal(ForceFields.GROMOS54A7),
  z.literal(ForceFields.OPLS_AA_L)
])

export type ForceField = z.infer<typeof ForceField>

/* WATER MODELS */
export const WaterModels = {
  SPC: "spc",
  SPC_E: "spce",
  SPC216: "SPC216",
  TIP3P: "tip3p",
  TIPS3P: "TIPS3P",
  TIP4P: "tip4p",
  TIP4P_EW: "tip4pew",
  TIP5P: "tip5p",
  TIP5_PE: "tip5pe",
  None: "None",
} as const

export const WaterModel = z.union([
  z.literal(WaterModels.SPC216),
  z.literal(WaterModels.TIP3P),
  z.literal(WaterModels.TIPS3P),
  z.literal(WaterModels.TIP4P),
  z.literal(WaterModels.TIP4P_EW),
  z.literal(WaterModels.TIP5P),
  z.literal(WaterModels.TIP5_PE),
  z.literal(WaterModels.SPC),
  z.literal(WaterModels.SPC_E),
  z.literal(WaterModels.None)
])

export type WaterModel = z.infer<typeof WaterModel>

export const ForceFieldToWaterModelMap: Record<ForceField, WaterModel[]> = {
  [ForceFields.AMBER94]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.AMBER96]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.AMBER99]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.AMBER99SB]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.AMBER99SB_ILDN]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.AMBERGS]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP5P],
  [ForceFields.CHARMM27]: [WaterModels.None, WaterModels.TIP3P, WaterModels.TIP4P, WaterModels.TIPS3P, WaterModels.TIP5P, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS43A1]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS43A2]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS45A3]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS53A5]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS53A6]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.GROMOS54A7]: [WaterModels.None, WaterModels.SPC, WaterModels.SPC_E],
  [ForceFields.OPLS_AA_L]: [WaterModels.None, WaterModels.TIP4P, WaterModels.TIP4P_EW, WaterModels.TIP3P, WaterModels.TIP5P, WaterModels.TIP5_PE, WaterModels.SPC, WaterModels.SPC_E],
}

export const WaterModelCoordinateTemplates = {
  [WaterModels.TIP3P]: "spc216.gro",
  [WaterModels.TIPS3P]: "spc216.gro",
  [WaterModels.SPC]: "spc216.gro",
  [WaterModels.SPC_E]: "spc216.gro",
  [WaterModels.SPC216]: "spc216.gro",
  [WaterModels.TIP4P]: "tip4p.gro",
  [WaterModels.TIP4P_EW]: "tip4p.gro",
  [WaterModels.TIP5P]: "tip5p.gro",
  [WaterModels.TIP5_PE]: "tip5p.gro",
}

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
export const SolventGroups = {
  SOL: "SOL",
  HOH: "HOH",
} as const

export const SolventGroup = z.union([
  z.literal(SolventGroups.SOL),
  z.literal(SolventGroups.HOH)
])

export type SolventGroup = z.infer<typeof SolventGroup>

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

export type EquilibrationOptions = "none" | "nvt" | "npt" | "both"

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