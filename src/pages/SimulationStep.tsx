import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext";
import {
  ForceFields,
  PositiveIonTypes,
  NegativeIonTypes,
  WaterModels,
  BoxTypes,
  type PositiveIonType,
  type NegativeIonType,
  type ForceField,
  type WaterModel,
  type BoxType,
} from "@/types/simulation.types";

export default function SimulationStep() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(stepNumber || "1");
  const totalSteps = 9;
  const [copied, setCopied] = useState(false);
  const simulation = useSimulation();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      navigate(`/simulation/new/${currentStep + 1}`);
    } else {
      // Save simulation to localStorage and navigate to dashboard
      simulation.completeSimulation();
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      navigate(`/simulation/new/${currentStep - 1}`);
    }
  };

  // Check if current step has all required fields filled
  const isCurrentStepValid = (): boolean => {
    const params = simulation.currentSimulation?.simulation_params;

    switch (currentStep) {
      case 1:
        return !!simulation.currentSimulation?.simName?.trim();
      case 2:
        return !!params?.proteinId?.trim();
      case 3:
        return !!params?.forceField && !!params?.waterModel;
      case 4:
        return !!(params as any)?.boxDistance && !!params?.boxType;
      case 5:
        return (
          !!params?.positiveIon &&
          !!params?.negativeIon &&
          !!(params as any)?.solventGroup &&
          !!(params as any)?.ion_concentration
        );
      case 6:
      case 7:
      case 8:
      case 9:
        return true;
      default:
        return false;
    }
  };

  // Helper component for controlled combobox
  const ControlledCombobox = ({
    label,
    items,
    value,
    onChange,
  }: {
    label: string;
    items: string[];
    value?: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Combobox
        items={items}
        value={value ?? null}
        onValueChange={(val) => val && onChange(val)}
      >
        <ComboboxInput placeholder={`Select ${label.toLowerCase()}`} />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );

  // Helper component for checkbox
  const CheckboxItem = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300"
      />
      <label htmlFor={label} className="text-sm font-medium cursor-pointer">
        {label}
      </label>
    </div>
  );

  // Generate GROMACS commands with actual values
  const getStepCode = (step: number): string => {
    const params = simulation.currentSimulation?.simulation_params;
    const codes: { [key: number]: string } = {
      2: "TODO: add protein download command here",
      3: `gmx pdb2gmx -f ${params?.proteinId || "[PDB_ID]"}.pdb -o ${params?.proteinId || "[PDB_ID]"}.gro -water ${params?.waterModel || "[WATER_MODEL]"} -ff ${params?.forceField || "[FORCE_FIELD]"}`,
      4: `gmx editconf -f ${params?.proteinId || "[PDB_ID]"}.gro -o ${params?.proteinId || "[PDB_ID]"}_box.gro -c -d ${(params as any)?.boxDistance || "[DISTANCE]"} -bt ${params?.boxType || "[BOX_TYPE]"} \ngmx solvate -cp ${params?.proteinId || "[PDB_ID]"}_inBox.gro -o ${params?.proteinId || "[PDB_ID]"}_inSolution.gro -p topol.top -cs ${params?.waterModel || "[WATER_MODEL]"}.gro`,
      //TODO from here
      5: `gmx grompp -f ions.mdp -c ${params?.proteinId || "[PDB_ID]"}_inSolution.gro -p topol.top -o ${params?.proteinId || "[PDB_ID]"}_ions.tpr\ngmx genion -s ${params?.proteinId || "[PDB_ID]"}_ions.tpr -o ${params?.proteinId || "[PDB_ID]"}_ions.gro -p topol.top -pname ${params?.positiveIon || "[POSITIVE_ION]"} -nname ${params?.negativeIon || "[NEGATIVE_ION]"} -conc ${params?.ion_concentration || "[ION_CONCENTRATION]"}`,
      6: `gmx grompp -f minim.mdp -c ${params?.proteinId || "[PDB_ID]"}_ions.gro -p topol.top -o ${params?.proteinId || "[PDB_ID]"}_em.tpr\ngmx mdrun -v -deffnm ${params?.proteinId || "[PDB_ID]"}_em\ngmx energy -f ${params?.proteinId || "[PDB_ID]"}_em.edr -o ${params?.proteinId || "[PDB_ID]"}.potential.xvg`,
      7: `gmx grompp -f nvt.mdp -c ${params?.proteinId || "[PDB_ID]"}_em.gro -r ${params?.proteinId || "[PDB_ID]"}_em.gro -p topol.top -o ${params?.proteinId || "[PDB_ID]"}_nvt.tpr\ngmx mdrun -deffnm ${params?.proteinId || "[PDB_ID]"}_nvt -nb gpu`,
      8: `gmx energy -f ${params?.proteinId || "[PDB_ID]"}_nvt.edr -o ${params?.proteinId || "[PDB_ID]"}_temperature.xvg\ngrompp -f npt.mdp -c ${params?.proteinId || "[PDB_ID]"}_nvt.gro -r ${params?.proteinId || "[PDB_ID]"}_nvt.gro -t ${params?.proteinId || "[PDB_ID]"}_nvt.cpt -p topol.top -o ${params?.proteinId || "[PDB_ID]"}_npt.tpr\ngmx mrun -deffnm ${params?.proteinId || "[PDB_ID]"}_npt -nb gpu\ngmx energy -f ${params?.proteinId || "[PDB_ID]"}_npt.edr -o ${params?.proteinId || "[PDB_ID]"}_pressure.xvg\ngmx energy -f ${params?.proteinId || "[PDB_ID]"}_npt.edr -o ${params?.proteinId || "[PDB_ID]"}_density.xvg`,
      9: `gmx grompp -f md.mdp -c ${params?.proteinId || "[PDB_ID]"}_npt.gro -t ${params?.proteinId || "[PDB_ID]"}_npt.cpt -p topol.top -o ${params?.proteinId || "[PDB_ID]"}_md.tpr\ngmx mdrun -deffnm ${params?.proteinId || "[PDB_ID]"}_md -nb gpu`,
    };
    return codes[step] || "";
  };

  // TODO: confirm that bash script generation is correct and complete once all steps are implemented
  const getCompleteBashScript = (): string => {
    const params = simulation.currentSimulation?.simulation_params;
    const simName =
      simulation.currentSimulation?.simName || "Unknown Simulation";

    return `#!/bin/bash
  # GROMACS Molecular Dynamics Simulation Script
  # Simulation Name: ${simName}
  # Generated: ${new Date().toISOString()}

  # ===== CONFIGURATION =====
  # Protein: ${params?.proteinId || "[PDB_ID]"}
  # Force Field: ${params?.forceField || "[FORCE_FIELD]"}
  # Water Model: ${params?.waterModel || "[WATER_MODEL]"}
  # Box Type: ${params?.boxType || "[BOX_TYPE]"}
  # Box Distance: ${(params as any)?.boxDistance || "[DISTANCE]"} nm
  # Positive Ion: ${params?.positiveIon || "[POSITIVE_ION]"}
  # Negative Ion: ${params?.negativeIon || "[NEGATIVE_ION]"}
  # Solvent Group: ${(params as any)?.solventGroup || "[SOLVENT_GROUP]"}
  # Ion Concentration: ${(params as any)?.ion_concentration || "[ION_CONCENTRATION]"} M

  echo "Starting GROMACS simulation: ${simName}"

  # ===== STEP 1: Download Protein Structure =====
  echo "Step 1: Downloading protein structure..."
  ${getStepCode(2)}

  # ===== STEP 2: Create Topology =====
  echo "Step 2: Creating topology..."
  ${getStepCode(3)}

  # ===== STEP 3: Define Box and Solvate =====
  echo "Step 3: Defining box and solvating..."
  ${getStepCode(4)}

  # ===== STEP 4: Add Ions =====
  echo "Step 4: Adding ions..."
  ${getStepCode(5)}

  # ===== STEP 5: Energy Minimization =====
  echo "Step 5: Running energy minimization..."
  ${getStepCode(6)}

  # ===== STEP 6: NVT Equilibration =====
  echo "Step 6: Running NVT equilibration..."
  ${getStepCode(7)}

  # ===== STEP 7: NPT Equilibration and Validation =====
  echo "Step 7: Running NPT equilibration and validation..."
  ${getStepCode(8)}

  # ===== STEP 8: Production MD =====
  echo "Step 8: Running production MD..."
  ${getStepCode(9)}

  echo "Simulation complete!"
  `;
  };

  const copyCode = () => {
    const code = getStepCode(currentStep);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCompleteScript = () => {
    const script = getCompleteBashScript();
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBashScript = () => {
    const script = getCompleteBashScript();
    const simName = simulation.currentSimulation?.simName || "simulation";
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${simName.replace(/\s+/g, "_")}_gromacs.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CodeBlock = () => (
    <div className="mt-6 relative flex flex-row items-center gap-4">
      <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word">
        <code className="text-sm">{getStepCode(currentStep)}</code>
      </pre>
      <Button size="sm" variant="outline" onClick={copyCode}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );

  const renderStepContent = () => {
    const params = simulation.currentSimulation?.simulation_params;

    switch (currentStep) {
      // STEP ONE: Simulation Name
      case 1:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">
              What is the name of this simulation?
            </h2>
            <p>
              Title it something meaningful so you can remember what it was.
            </p>
            <Input
              placeholder="eg. PHYS 3245 Midterm Simulation"
              className="mt-2"
              value={simulation.currentSimulation?.simName || ""}
              onChange={(e) => simulation.updateSimulationName(e.target.value)}
            />
          </div>
        );

      // STEP TWO: Protein Selection
      case 2:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">
              Choose a protein for the simulation
            </h2>
            <p>Enter the PDB ID of the protein you want to simulate.</p>
            <Input
              placeholder="e.g. 1A2B"
              className="mt-2"
              value={params?.proteinId || ""}
              onChange={(e) => simulation.updateProteinId(e.target.value)}
            />
            <CodeBlock />
          </div>
        );

      //STEP THREE: Topology Creation
      case 3:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Create the topology</h2>
            <p>Select the force field and water model for your simulation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
              <ControlledCombobox
                label="Force Field"
                items={Object.values(ForceFields)}
                value={params?.forceField}
                onChange={(value) =>
                  simulation.updateForceField(value as ForceField)
                }
              />
              <ControlledCombobox
                label="Water Model"
                items={Object.values(WaterModels)}
                value={params?.waterModel}
                onChange={(value) =>
                  simulation.updateWaterModel(value as WaterModel)
                }
              />
            </div>
            <CodeBlock />
          </div>
        );

      //STEP FOUR: Box Definition and Solvation
      case 4:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Fill the box with water</h2>
            <p>Define the box dimensions and type for solvation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
              <ControlledCombobox
                label="Distance"
                items={["1.0", "1.2", "1.5", "2.0"]}
                value={(params as any)?.boxDistance}
                onChange={(value) => simulation.updateBoxDistance(value)}
              />
              <ControlledCombobox
                label="Box Type"
                items={Object.values(BoxTypes)}
                value={params?.boxType}
                onChange={(value) => simulation.updateBoxType(value as BoxType)}
              />
            </div>
            <CodeBlock />
          </div>
        );

      // STEP FIVE: Ionization
      case 5:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Add ions to the box</h2>
            <p>Select the ion types to neutralize the system.</p>
            <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
              <ControlledCombobox
                label="Positive Ion"
                items={Object.values(PositiveIonTypes)}
                value={params?.positiveIon}
                onChange={(value) =>
                  simulation.updatePositiveIon(value as PositiveIonType)
                }
              />
              <ControlledCombobox
                label="Negative Ion"
                items={Object.values(NegativeIonTypes)}
                value={params?.negativeIon}
                onChange={(value) =>
                  simulation.updateNegativeIon(value as NegativeIonType)
                }
              />
              <ControlledCombobox
                label="Solvent Group"
                //TODO: replace this with actual supported solvent groups once we have them defined
                items={["SOL", "WAT", "HOH"]}
                value={(params as any)?.solventGroup}
                onChange={(value) => simulation.updateSolventGroup(value)}
              />
              <ControlledCombobox
                label="Ion Concentration"
                items={["0.1", "0.15", "0.2", "0.5", "1.0"]}
                value={(params as any)?.ion_concentration?.toString()}
                onChange={(value) =>
                  simulation.updateIonConcentration(parseFloat(value))
                }
              />
            </div>
            <CodeBlock />
          </div>
        );

      // STEP SIX: Minimization
      case 6:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Conduct minimization</h2>
            <p>
              Energy minimization will be performed using default parameters.
              Advanced users can conduct their own version of this step.
            </p>
            <CodeBlock />
          </div>
        );

      // STEP SEVEN: Equilibration
      case 7:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Equilibriate the system</h2>
            <p>NVT equilibration will be performed to stabilize temperature.</p>
            <CodeBlock />
          </div>
        );

      // STEP EIGHT: Validation
      case 8:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">System validation</h2>
            <p>Select which properties to validate after equilibration.</p>
            <div className="flex flex-col gap-3 mt-4">
              <CheckboxItem
                label="Temperature"
                checked={params?.verificationParams?.temperature || false}
                onChange={(checked) =>
                  simulation.updateVerification("temperature", checked)
                }
              />
              <CheckboxItem
                label="Pressure"
                checked={params?.verificationParams?.pressure || false}
                onChange={(checked) =>
                  simulation.updateVerification("pressure", checked)
                }
              />
              <CheckboxItem
                label="System Volume"
                checked={params?.verificationParams?.system_volume || false}
                onChange={(checked) =>
                  simulation.updateVerification("system_volume", checked)
                }
              />
            </div>
            <CodeBlock />
          </div>
        );

      // TODO: new step here once we get to data analysis

      // STEP NINE: Review and submit
      case 9:
        return (
          <div className="gap-4 flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold mb-2">
              Complete Your Simulation
            </h2>
            <p className="text-center">
              Review your simulation settings and download or copy the complete
              GROMACS bash script.
            </p>

            {/* Complete Script */}
            <div className="mt-6 w-full">
              <h3 className="font-semibold mb-2">Complete GROMACS Script</h3>
              <div className="relative flex flex-col gap-2">
                <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto text-left">
                  <code className="text-xs">{getCompleteBashScript()}</code>
                </pre>
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyCompleteScript}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy Script"}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={downloadBashScript}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download .sh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="flex flex-col p-6 px-[10%] w-full max-h-full">
      <div className="w-full">{renderStepContent()}</div>

      <div className="flex justify-between border-t pt-4 mt-6 w-full">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
          {currentStep === totalSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
