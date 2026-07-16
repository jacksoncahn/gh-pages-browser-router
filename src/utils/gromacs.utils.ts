import {
  WaterModelCoordinateTemplates,
  type Simulation,
  type SimulationParams,
  type SimulationDraft
} from '@/types/simulation.types'

/**
 * Echo values for different gmx energy command outputs.
 */
const ECHO_VALUES = {
  potential: `Potential\\n0\\n`,
  temperature: `Temperature\\n0\\n`,
  pressure: `Pressure\\n0\\n`,
  density: `Density\\n0\\n`,
  system_volume: `Volume\\n0\\n`,
  solvent_SOL: `SOL\\n0\\n`
} as const

/**
 * Resolves the display value for each parameter used across command generation,
 * falling back to a bracketed placeholder when the value hasn't been set yet.
 */
function resolveDisplayParams(params?: Partial<SimulationParams> | null) {
  return {
    gromacsVersion: params?.gromacsVersion || '[GROMACS_VERSION]',
    proteinId: params?.proteinId || '[PDB_ID]',
    forceField: params?.forceField || '[FORCE_FIELD]',
    waterModel: params?.waterModel || '[WATER_MODEL]',
    boxType: params?.boxType || '[BOX_TYPE]',
    boxDistance: params?.boxDistance || '[DISTANCE]',
    positiveIon: params?.positiveIon || '[POSITIVE_ION]',
    negativeIon: params?.negativeIon || '[NEGATIVE_ION]',
    solventGroup: params?.solventGroup || '[SOLVENT_GROUP]'
  }
}

/**
 * Prefixes a gmx command with an `echo -e` pipe supplying the interactive
 * prompt answer, when the command is destined for a non-interactive bash script.
 */
function withEcho(command: string, echoValue: string, inBashScript: boolean): string {
  return inBashScript ? `echo -e "${echoValue}" | ${command}` : command
}

/**
 * Looks up the `-cs` coordinate file for a water model. Returns "" for
 * values that aren't a real water model (e.g. "None" or an unset placeholder).
 */
function waterModelCoordinateFile(waterModel: string): string {
  return (WaterModelCoordinateTemplates as Record<string, string>)[waterModel] ?? ''
}

/**
 * Generates GROMACS commands for a specific simulation step.
 * Uses placeholder format [PLACEHOLDER] for missing values.
 *
 * @param step - Step number (2-9); other step numbers have no command and return ""
 * @param params - Simulation parameters
 * @returns GROMACS command(s) for the specified step
 */
export function generateStepCommand(
  step: number,
  params?: Partial<SimulationParams> | null,
  inBashScript: boolean = false
): string {
  const { gromacsVersion, proteinId, forceField, waterModel, boxType, boxDistance, positiveIon, negativeIon } =
    resolveDisplayParams(params)
  const cleanProtein = params?.cleanProtein
  const ionConcentration = params?.ionConcentration ?? null
  const neutralizeSystem = params?.neutralizeSystem || false
  const useGpu = params?.useGpu || false
  const equilibration = params?.equilibrationOptions || 'none'
  const verification = params?.verificationParams

  const enableMaxIonsWarning = params?.enableMaxIonsWarning || false
  const maxIonWarnings = params?.maxIonWarnings != null ? params.maxIonWarnings : '[MAX_ION_WARNINGS]'
  const enableMaxMinimizationWarning = params?.enableMaxMinimizationWarning || false
  const maxMinimizationWarnings =
    params?.maxMinimizationWarnings != null ? params.maxMinimizationWarnings : '[MAX_MINIMIZATION_WARNINGS]'
  const enableMaxEquilibrationWarning = params?.enableMaxEquilibrationWarning || false
  const maxEquilibrationWarnings =
    params?.maxEquilibrationWarnings != null ? params.maxEquilibrationWarnings : '[MAX_EQUILIBRATION_WARNINGS]'
  const enableRunSimulationWarning = params?.enableRunSimulationWarning || false
  const maxRunSimulationWarnings =
    params?.maxRunSimulationWarnings != null ? params.maxRunSimulationWarnings : '[MAX_RUN_SIMULATION_WARNINGS]'

  // genion accepts -neutral and -conc together (neutralize the net charge, then
  // add the requested salt concentration on top), so both flags can be present at once.
  const genionFlags = [
    neutralizeSystem ? '-neutral' : '',
    ionConcentration != null ? `-conc ${ionConcentration}` : '',
    enableMaxIonsWarning ? `-maxwarn ${maxIonWarnings}` : ''
  ]
    .filter(Boolean)
    .join(' ')
  const genionCmd = `${gromacsVersion} genion -s ${proteinId}_ions.tpr -o ${proteinId}_ions.gro -p topol.top -pname ${positiveIon} -nname ${negativeIon}${genionFlags ? ` ${genionFlags}` : ''}`

  const nbFlag = useGpu ? ' -nb gpu' : ''

  const minimizationEnergyCmd = `${gromacsVersion} energy -f ${proteinId}_em.edr -o ${proteinId}_potential.xvg`

  const verificationCmd = [
    verification?.temperature
      ? withEcho(
          `${gromacsVersion} energy -f ${proteinId}_nvt.edr -o ${proteinId}_temperature.xvg`,
          ECHO_VALUES.temperature,
          inBashScript
        )
      : '',
    verification?.pressure
      ? withEcho(
          `${gromacsVersion} energy -f ${proteinId}_npt.edr -o ${proteinId}_pressure.xvg`,
          ECHO_VALUES.pressure,
          inBashScript
        )
      : '',
    verification?.system_volume
      ? withEcho(
          `${gromacsVersion} energy -f ${proteinId}_npt.edr -o ${proteinId}_volume.xvg`,
          ECHO_VALUES.system_volume,
          inBashScript
        )
      : ''
  ]
    .filter(Boolean)
    .join('\n')

  const equilibrationCmd = [
    equilibration === 'nvt' || equilibration === 'both'
      ? `${gromacsVersion} grompp -f nvt.mdp -c ${proteinId}_em.gro -r ${proteinId}_em.gro -p topol.top -o ${proteinId}_nvt.tpr\n${gromacsVersion} mdrun -deffnm ${proteinId}_nvt${nbFlag}`
      : '',
    equilibration === 'npt' || equilibration === 'both'
      ? `${gromacsVersion} grompp -f npt.mdp -c ${proteinId}_nvt.gro -r ${proteinId}_nvt.gro -t ${proteinId}_nvt.cpt -p topol.top -o ${proteinId}_npt.tpr\n${gromacsVersion} mdrun -deffnm ${proteinId}_npt${nbFlag}`
      : ''
  ]
    .filter(Boolean)
    .join('\n')

  const commands: { [key: number]: string } = {
    2: `wget https://files.rcsb.org/download/${proteinId}.pdb \n${cleanProtein ? `grep -v HOH ${proteinId}.pdb > ${proteinId}_clean.pdb\n` : ''}`,
    3: `${gromacsVersion} pdb2gmx -f ${cleanProtein ? `${proteinId}_clean.pdb` : `${proteinId}.pdb`} -o ${proteinId}.gro -water ${waterModel} -ff ${forceField}`,
    4: `${gromacsVersion} editconf -f ${proteinId}.gro -o ${proteinId}_box.gro -c -d ${boxDistance} -bt ${boxType} \n${gromacsVersion} solvate -cp ${proteinId}_box.gro -o ${proteinId}_inSolution.gro -p topol.top ${waterModel !== 'None' && waterModel !== '[WATER_MODEL]' ? `-cs ${waterModelCoordinateFile(waterModel)}` : ''}`,
    5: `${gromacsVersion} grompp -f ions.mdp -c ${proteinId}_inSolution.gro -p topol.top -o ${proteinId}_ions.tpr\n${withEcho(genionCmd, ECHO_VALUES.solvent_SOL, inBashScript)}`,
    6: `${gromacsVersion} grompp -f minim.mdp -c ${proteinId}_ions.gro -p topol.top -o ${proteinId}_em.tpr\n${gromacsVersion} mdrun -deffnm ${proteinId}_em\n${withEcho(minimizationEnergyCmd, ECHO_VALUES.potential, inBashScript)} ${enableMaxMinimizationWarning ? `-maxwarn ${maxMinimizationWarnings}` : ''}`,
    7: `${equilibrationCmd}${enableMaxEquilibrationWarning ? ` -maxwarn ${maxEquilibrationWarnings}` : ''}`,
    8: verificationCmd,
    9: `${gromacsVersion} grompp -f md.mdp -c ${proteinId}_npt.gro -t ${proteinId}_npt.cpt -p topol.top -o ${proteinId}_md.tpr\n${gromacsVersion} mdrun -deffnm ${proteinId}_md${nbFlag} ${enableRunSimulationWarning ? `-maxwarn ${maxRunSimulationWarnings}` : ''}`
  }

  return commands[step] || ''
}

/**
 * Generates a complete bash script for the entire GROMACS simulation workflow.
 * Includes configuration header with all parameters and all simulation steps.
 *
 * @param simulation - Complete or partial simulation object
 * @param useISODate - Use ISO date format (default: true)
 * @returns Complete bash script as a string
 */
export function generateCompleteBashScript(
  simulation: Simulation | Partial<Simulation> | SimulationDraft | null | undefined,
  useISODate: boolean = true
): string {
  if (!simulation) {
    return ''
  }

  const params = simulation.simulation_params
  const simName = simulation.simName || 'Unknown Simulation'
  const dateString = useISODate
    ? new Date().toISOString()
    : simulation.created_at
      ? new Date(simulation.created_at).toLocaleString()
      : new Date().toLocaleString()

  const {
    gromacsVersion,
    proteinId,
    forceField,
    waterModel,
    boxType,
    boxDistance,
    positiveIon,
    negativeIon,
    solventGroup
  } = resolveDisplayParams(params)
  const ionConcentration = params?.ionConcentration

  return `#!/bin/bash
# GROMACS Molecular Dynamics Simulation Script
# Simulation Name: ${simName}
# GROMACS Version: ${gromacsVersion}
# Generated: ${dateString}

# ===== CONFIGURATION =====
# Protein: ${proteinId}
# Force Field: ${forceField}
# Water Model: ${waterModel}
# Box Type: ${boxType}
# Box Distance: ${boxDistance} nm
# Positive Ion: ${positiveIon}
# Negative Ion: ${negativeIon}
# Solvent Group: ${solventGroup}
# Ion Concentration: ${ionConcentration ?? 0} M

echo "Starting GROMACS simulation: ${simName}"

# ===== STEP 1: Download Protein Structure =====
echo "Step 1: Downloading protein structure..."
${generateStepCommand(2, params, true)}

# ===== STEP 2: Create Topology =====
echo "Step 2: Creating topology..."
${generateStepCommand(3, params, true)}

# ===== STEP 3: Define Box and Solvate =====
echo "Step 3: Defining box and solvating..."
${generateStepCommand(4, params, true)}

# ===== STEP 4: Add Ions =====
echo "Step 4: Adding ions..."
${generateStepCommand(5, params, true)}

# ===== STEP 5: Energy Minimization =====
echo "Step 5: Running energy minimization..."
${generateStepCommand(6, params, true)}

# ===== STEP 6: Equilibration =====
echo "Step 6: Running requested equilibration..."
${generateStepCommand(7, params, true)}

# ===== STEP 7: Validation =====
echo "Step 7: Running validation..."
${generateStepCommand(8, params, true)}

# ===== STEP 8: Production MD =====
echo "Step 8: Running production MD..."
${generateStepCommand(9, params, true)}

echo "Simulation complete!"
`
}
