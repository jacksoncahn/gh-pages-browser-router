import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext";
import { ControlledCombobox } from "@/components/shared/ControlledCombobox";
import { CheckboxItem } from "@/components/shared/CheckboxItem";
import { CodeBlock } from "@/components/shared/CodeBlock";
import {
  generateStepCommand,
  generateCompleteBashScript,
} from "@/utils/gromacs.utils";
import {
  downloadTextFile,
  copyToClipboard,
  downloadPDBFile,
} from "@/utils/download.utils";
import {
  ForceFields,
  PositiveIonTypes,
  NegativeIonTypes,
  WaterModels,
  BoxTypes,
  ForceFieldToWaterModelMap,
  type PositiveIonType,
  type NegativeIonType,
  type ForceField,
  type WaterModel,
  type BoxType,
} from "@/types/simulation.types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export default function SimulationStep() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(stepNumber || "1");
  const totalSteps = 9;
  const simulation = useSimulation();
  const [copied, setCopied] = useState(false);

  // bash script handlers
  const handleCopyBashScript = async () => {
    const script = generateCompleteBashScript(simulation.currentSimulation);
    const success = await copyToClipboard(script);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadBashScript = () => {
    const script = generateCompleteBashScript(simulation.currentSimulation);
    const simName = simulation.currentSimulation?.simName || "simulation";
    const filename = `${simName.replace(/\s+/g, "_")}_gromacs.sh`;
    downloadTextFile(script, filename);
  };

  // navigation handlers
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

  // Get allowed water models for the selected force field
  const getAllowedWaterModels = (): WaterModel[] => {
    const forceField =
      simulation.currentSimulation?.simulation_params?.forceField;
    if (!forceField) return Object.values(WaterModels);
    return ForceFieldToWaterModelMap[forceField] || Object.values(WaterModels);
  };

  // Handle force field change with water model validation
  const handleForceFieldChange = (newForceField: ForceField) => {
    simulation.updateForceField(newForceField);

    const currentWaterModel =
      simulation.currentSimulation?.simulation_params?.waterModel;
    const allowedModels = ForceFieldToWaterModelMap[newForceField];

    if (currentWaterModel && !allowedModels.includes(currentWaterModel)) {
      simulation.updateWaterModel("" as WaterModel);
    }
  };

  const isValidPDBId = (pdbId: string) => {
    if (!pdbId) return false;
    const pdbPattern = /^[0-9][A-Za-z0-9]{3}$/;
    return pdbPattern.test(pdbId.trim());
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
          !!(params as any)?.solventGroup
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
            <div className="flex flex-col gap-2 w-full max-w-md">
              <Input
                placeholder="e.g. 1AKI"
                className="mt-2"
                value={params?.proteinId || ""}
                onChange={(e) =>
                  simulation.updateProteinId(e.target.value.toUpperCase())
                }
              />
              <Button
                variant="outline"
                onClick={() => downloadPDBFile(params?.proteinId || "")}
                disabled={!isValidPDBId(params?.proteinId || "")}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download {params?.proteinId?.toUpperCase() || "PDB"} File
              </Button>
              {params?.proteinId && !isValidPDBId(params.proteinId) && (
                <p className="text-sm text-destructive">
                  Invalid PDB ID format. Should be 4 characters (e.g., 1AKI,
                  108D).
                </p>
              )}
              <FieldGroup className="mt-4">
                <Field orientation="horizontal">
                  <Checkbox
                    id="clean-protein"
                    name="clean-protein"
                    onCheckedChange={simulation.updateCleanProtein}
                    checked={!!params?.cleanProtein}
                  />
                  <FieldLabel htmlFor="clean-protein">
                    Remove structural waters from protein
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </div>
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
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
                  handleForceFieldChange(value as ForceField)
                }
              />
              <ControlledCombobox
                label="Water Model"
                items={getAllowedWaterModels()}
                value={params?.waterModel}
                onChange={(value) =>
                  simulation.updateWaterModel(value as WaterModel)
                }
                placeholder={
                  params?.forceField
                    ? "Select water model"
                    : "Select force field first"
                }
              />
            </div>
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
          </div>
        );

      //STEP FOUR: Box Definition and Solvation
      case 4:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Fill the box with water</h2>
            <p>Define the box dimensions and type for solvation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Distance (nm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 1.0"
                  step="0.1"
                  min="0.1"
                  value={(params as any)?.boxDistance || ""}
                  onChange={(e) =>
                    simulation.updateBoxDistance(
                      parseFloat(e.target.value) || 0,
                    )
                  }
                />
              </div>
              <ControlledCombobox
                label="Box Type"
                items={Object.values(BoxTypes)}
                value={params?.boxType}
                onChange={(value) => simulation.updateBoxType(value as BoxType)}
              />
            </div>
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
          </div>
        );

      // STEP FIVE: Ionization
      case 5:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Add ions to the box</h2>
            <p>Select the ion types to neutralize the system.</p>
            <div className="flex flex-col gap-8 mt-4">
              <div className="flex flex-row gap-4">
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
              </div>

              <div className="flex flex-row w-full gap-4">
                <ControlledCombobox
                  label="Solvent Group"
                  //TODO: replace this with actual supported solvent groups once we have them defined
                  items={["SOL", "WAT", "HOH"]}
                  value={(params as any)?.solventGroup}
                  onChange={(value) => simulation.updateSolventGroup(value)}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Ion Concentration (M)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 0.15"
                    step="0.05"
                    min="0"
                    value={(params as any)?.ion_concentration}
                    onChange={(e) =>
                      simulation.updateIonConcentration(
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
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
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
          </div>
        );

      // STEP SEVEN: Equilibration
      case 7:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Equilibriate the system</h2>
            <p>Choose what type of equilibration you would like to use</p>
            <ControlledCombobox
              label="Equilibration Type"
              items={["None", "NPT", "NVT", "Both"]}
              value={(params as any)?.equilibriationOptions}
              onChange={(value) => simulation.updateEquilibriation(value.toLowerCase() as any)}
              horizontal
            />

            {(simulation.currentSimulation?.simulation_params?.equilibriationOptions === "nvt" || simulation.currentSimulation?.simulation_params?.equilibriationOptions === "npt" || simulation.currentSimulation?.simulation_params?.equilibriationOptions === "both") && (
              <p className="text-sm text-muted-foreground mt-2">
                For NVT and/or NPT equilibriation, you must have the respective <code>nvt.mdp</code> and/or <code>npt.mdp</code> files in your project directory with the appropriate parameters set. The generated script will use those files for equilibration.
              </p>
            )}

            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
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
            <CodeBlock
              code={generateStepCommand(
                currentStep,
                simulation.currentSimulation?.simulation_params,
              )}
            />
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
                  <code className="text-xs">
                    {generateCompleteBashScript(simulation.currentSimulation)}
                  </code>
                </pre>
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyBashScript}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy Script"}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleDownloadBashScript}
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
    <div className="flex flex-col p-6 px-[10%] w-full h-full max-h-screen">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full">{renderStepContent()}</div>
      </div>

      <div className="flex justify-between border-t pt-4 mt-6 w-full">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
          {currentStep === totalSteps ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
