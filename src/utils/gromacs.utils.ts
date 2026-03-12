import { WaterModelCoordinateTemplates, type Simulation, type SimulationParams } from "@/types/simulation.types";

/**
 * Echo values for different gmx energy command outputs.
 */
const ENERGY_ECHO_VALUES = {
  potential: "potential 0",
  temperature: "vir-yy 0",
  pressure: "vir-zx 0",
  density: "pres-yx 0",
  system_volume: "volume 0",
} as const;

/**
 * Generates GROMACS commands for a specific simulation step.
 * Uses placeholder format [PLACEHOLDER] for missing values.
 * 
 * @param step - Step number (1-9)
 * @param params - Simulation parameters
 * @returns GROMACS command(s) for the specified step
 */
export function generateStepCommand(
  step: number,
  params?: SimulationParams,
  inBashScript: boolean = false
): string {
  const proteinId = params?.proteinId || "[PDB_ID]";
  const cleanProtein = params?.cleanProtein
  const forceField = params?.forceField || "[FORCE_FIELD]";
  const waterModel = params?.waterModel || "[WATER_MODEL]";
  const boxType = params?.boxType || "[BOX_TYPE]";
  const boxDistance = (params as any)?.boxDistance || "[DISTANCE]";
  const positiveIon = params?.positiveIon || "[POSITIVE_ION]";
  const negativeIon = params?.negativeIon || "[NEGATIVE_ION]";
  const ionConcentration = params?.ion_concentration || "[ION_CONCENTRATION]";
  const equilibriation = (params as any)?.equilibriationOptions || "none";
  const verification = params?.verificationParams

  const commands: { [key: number]: string } = {
    2: `wget https://files.rcsb.org/download/${proteinId}.pdb \n${cleanProtein ? `grep -v HOH ${proteinId}.pdb > ${proteinId}_clean.pdb\n` : ''}`,
    3: `gmx pdb2gmx -f ${cleanProtein ? `${proteinId}_clean.pdb` : `${proteinId}.pdb`} -o ${proteinId}.gro -water ${waterModel} -ff ${forceField}`,
    4: `gmx editconf -f ${proteinId}.gro -o ${proteinId}_box.gro -c -d ${boxDistance} -bt ${boxType} \ngmx solvate -cp ${proteinId}_box.gro -o ${proteinId}_inSolution.gro -p topol.top ${waterModel !== 'None' && waterModel !== '[WATER_MODEL]' ? `-cs ${WaterModelCoordinateTemplates[waterModel]}` : ""}`,
    5: `gmx grompp -f ions.mdp -c ${proteinId}_inSolution.gro -p topol.top -o ${proteinId}_ions.tpr\n${inBashScript ? `echo "13" | gmx genion -s ${proteinId}_ions.tpr -o ${proteinId}_ions.gro -p topol.top -pname ${positiveIon} -nname ${negativeIon} ${(ionConcentration != 0 && ionConcentration != "[ION_CONCENTRATION]") ? `-conc ${ionConcentration}` : "-neutral"}` : `gmx genion -s ${proteinId}_ions.tpr -o ${proteinId}_ions.gro -p topol.top -pname ${positiveIon} -nname ${negativeIon} ${(ionConcentration != 0 && ionConcentration != "[ION_CONCENTRATION]") ? `-conc ${ionConcentration}` : "-neutral"}`}`,
    6: `gmx grompp -f minim.mdp -c ${proteinId}_ions.gro -p topol.top -o ${proteinId}_em.tpr\ngmx mdrun -deffnm ${proteinId}_em\n${inBashScript ?
      `echo "${ENERGY_ECHO_VALUES.potential}" | gmx energy -f ${proteinId}_em.edr -o ${proteinId}_potential.xvg` :
      `gmx energy -f ${proteinId}_em.edr -o ${proteinId}_potential.xvg`}`,
    7: `${(equilibriation === "nvt" || equilibriation === "both") ? `gmx grompp -f nvt.mdp -c ${proteinId}_em.gro -r ${proteinId}_em.gro -p topol.top -o ${proteinId}_nvt.tpr\ngmx mdrun -deffnm ${proteinId}_nvt -nb gpu\n` : ""}${(equilibriation === "npt" || equilibriation === "both") ? `gmx grompp -f npt.mdb -c ${proteinId}_nvt.gro -r ${proteinId}_nvt.gro -t ${proteinId}_nvt.cpt -p topol.top -o ${proteinId}_npt.tpr\ngmx mdrun -deffnm ${proteinId}_npt -nb gpu` : ""}`,
    8: `${inBashScript ? `${verification?.temperature ? `\necho "${ENERGY_ECHO_VALUES.temperature}" | gmx energy -f ${proteinId}_nvt.edr -o ${proteinId}_temperature.xvg` : ""}${verification?.pressure ? `\necho "${ENERGY_ECHO_VALUES.pressure}" | gmx grompp -f npt.mdp -c ${proteinId}_nvt.gro -r ${proteinId}_nvt.gro -t ${proteinId}_nvt.cpt -p topol.top -o ${proteinId}_npt.tpr\ngmx energy -f ${proteinId}_npt.edr -o ${proteinId}_pressure.xvg` : ""}${verification?.system_volume ? `\necho "${ENERGY_ECHO_VALUES.system_volume}" | gmx energy -f ${proteinId}_npt.edr -o ${proteinId}_volume.xvg` : ""}` : `${verification?.temperature ? `\ngmx energy -f ${proteinId}_nvt.edr -o ${proteinId}_temperature.xvg` : ""}${verification?.pressure ? `\ngmx grompp -f npt.mdp -c ${proteinId}_nvt.gro -r ${proteinId}_nvt.gro -t ${proteinId}_nvt.cpt -p topol.top -o ${proteinId}_npt.tpr\ngmx energy -f ${proteinId}_npt.edr -o ${proteinId}_pressure.xvg` : ""}${verification?.system_volume ? `\ngmx energy -f ${proteinId}_npt.edr -o ${proteinId}_volume.xvg` : ""}`}`,
    9: `gmx grompp -f md.mdp -c ${proteinId}_npt.gro -t ${proteinId}_npt.cpt -p topol.top -o ${proteinId}_md.tpr\ngmx mdrun -deffnm ${proteinId}_md -nb gpu`,
  };

  return commands[step] || "";
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
  simulation: Simulation | Partial<Simulation> | null | undefined,
  useISODate: boolean = true
): string {
  if (!simulation) return "";

  const params = simulation.simulation_params;
  const simName = simulation.simName || "Unknown Simulation";
  const dateString = useISODate
    ? new Date().toISOString()
    : simulation.created_at
      ? new Date(simulation.created_at).toLocaleString()
      : new Date().toLocaleString();

  const proteinId = params?.proteinId || "[PDB_ID]";
  const forceField = params?.forceField || "[FORCE_FIELD]";
  const waterModel = params?.waterModel || "[WATER_MODEL]";
  const boxType = params?.boxType || "[BOX_TYPE]";
  const boxDistance = (params as any)?.boxDistance || "[DISTANCE]";
  const positiveIon = params?.positiveIon || "[POSITIVE_ION]";
  const negativeIon = params?.negativeIon || "[NEGATIVE_ION]";
  const solventGroup = (params as any)?.solventGroup || "[SOLVENT_GROUP]";
  const ionConcentration = params?.ion_concentration || "[ION_CONCENTRATION]";

  return `#!/bin/bash
# GROMACS Molecular Dynamics Simulation Script
# Simulation Name: ${simName}
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
# Ion Concentration: ${ionConcentration} M

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
echo "Step 7: Running NPT equilibration and validation..."
${generateStepCommand(8, params, true)}

# ===== STEP 8: Production MD =====
echo "Step 8: Running production MD..."
${generateStepCommand(9, params, true)}

echo "Simulation complete!"
`;
}
