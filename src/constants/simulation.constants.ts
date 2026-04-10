/**
 * Constants for simulation steps configuration
 */

export const TOTAL_STEPS = 11;

export const STEP_CONFIG = {
  0: {
    title: "What is the name of this simulation?",
    description: "Title it something meaningful so you can remember what it was.",
  },
  1: {
    title: "What version of GROMACS would you like to use?",
    description: "Select the GROMACS version for your simulation.",
  },
  2: {
    title: "Choose a protein for the simulation",
    description: "Enter the PDB ID of the protein you want to simulate.",
  },
  3: {
    title: "Create the topology",
    description: "Select the force field and water model for your simulation.",
  },
  4: {
    title: "Fill the box with water",
    description: "Define the box dimensions and type for solvation.",
  },
  5: {
    title: "Add ions to the box",
    description: "Select the ion types to neutralize the system.",
  },
  6: {
    title: "Conduct minimization",
    description:
      "Energy minimization will be performed using default parameters. Advanced users can conduct their own version of this step.",
  },
  7: {
    title: "Equilibriate the system",
    description: "Choose what type of equilibration you would like to use",
  },
  8: {
    title: "System validation",
    description: "Select which properties to validate after equilibration.",
  },
  9: {
    title: "Run production MD",
    description:
      "Run the production MD simulation with default parameters. Advanced users can run their own version of this step.",
  },
  10: {
    title: "Complete Your Simulation",
    description:
      "Review your simulation settings and download or copy the complete GROMACS bash script.",
  }
} as const;