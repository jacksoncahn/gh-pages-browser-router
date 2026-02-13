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

export default function SimulationStep() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(stepNumber || "1");
  const totalSteps = 9;
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      navigate(`/simulation/new/${currentStep + 1}`);
    } else {
      // TODO: Submit simulation and navigate to dashboard
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      navigate(`/simulation/new/${currentStep - 1}`);
    }
  };

  // Helper component for simple combobox
  const SimpleCombobox = ({
    label,
    items,
  }: {
    label: string;
    items: string[];
  }) => (
    <div className="flex flex-row gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Combobox items={items}>
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

  // TODO: validate code blocks for each step
  const getStepCode = (step: number): string => {
    const codes: { [key: number]: string } = {
      2: "gmx protein prep",
      3: "gmx pdb2gmx -f ${pdb_id}.pdb -o protein.gro -water [WATER_MODEL] -ff [FORCE_FIELD]",
      4: "gmx editconf -f protein.gro -o box.gro -bt [BOX_TYPE] -d [DISTANCE]",
      5: "gmx genion -s ions.tpr -o ions.gro -p topol.top -pname [PROTEIN_NAME] -nname [NNAME] -neutral",
      6: "gmx grompp -f minim.mdp -c ions.gro -p topol.top -o em.tpr\ngmx mdrun -v -deffnm em",
      7: "gmx grompp -f nvt.mdp -c em.gro -p topol.top -o nvt.tpr\ngmx mdrun -v -deffnm nvt",
      8: "gmx temp -f nvt.edr -o temperature.xvg\ngmx energy -f nvt.edr -o pressure.xvg\ngmx energy -f nvt.edr -o system_energy.xvg",
      9: "ngmx grompp -f md.mdp -c npt.gro -p topol.top -o md.tpr\ngmx mdrun -v -deffnm md",
    };
    return codes[step] || "";
  };

  const copyCode = () => {
    const code = getStepCode(currentStep);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CodeBlock = () => (
    <div className="mt-6 relative flex flex-row items-center gap-4">
        <pre className="bg-secondary p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word">
        <code className="text-sm">{getStepCode(currentStep)}</code>
      </pre>
      <Button size="sm" variant="outline" onClick={copyCode}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
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
            />
          </div>
        );
      case 2:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">
              Choose a protein for the simulation
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <SimpleCombobox label="Protein" items={["1A2B", "2C3D", "3E4F"]} />
            <CodeBlock />
          </div>
        );
      case 3:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Create the topology</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SimpleCombobox
                label="Force Field"
                items={["AMBER", "CHARMM", "OPLS", "GROMOS"]}
              />
              <SimpleCombobox
                label="Water Model"
                items={["TIP3P", "TIP4P", "SPC", "SPC/E"]}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 4:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Fill the box with water</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SimpleCombobox
                label="Distance"
                items={["1.0 nm", "1.2 nm", "1.5 nm", "2.0 nm"]}
              />
              <SimpleCombobox
                label="Box Type"
                items={["cubic", "dodecahedron", "octahedron", "triclinic"]}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 5:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Add ions to the box</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <SimpleCombobox
                label="Protein Name"
                items={["NA", "K", "CA", "MG"]}
              />
              <SimpleCombobox label="NName" items={["CL", "BR", "I"]} />
              <SimpleCombobox
                label="Solvent Group"
                items={["SOL", "WAT", "HOH"]}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 6:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Conduct minimization</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 7:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Equilibriate the system</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
              <SimpleCombobox
                label="Test"
                items={["Option 1", "Option 2", "Option 3"]}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 8:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">System validation</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sollicitudin, tellus eu efficitur luctus, sapien lorem gravida
              nunc, in posuere dolor metus id urna.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <CheckboxItem
                label="Temperature"
                checked={false}
                onChange={() => {}}
              />
              <CheckboxItem
                label="Pressure"
                checked={false}
                onChange={() => {}}
              />
              <CheckboxItem
                label="System"
                checked={false}
                onChange={() => {}}
              />
            </div>
            <CodeBlock />
          </div>
        );
      case 9:
        return (
          <div className="gap-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">
              Download the bash script
            </h2>
            <p>Download the complete bash script to run your simulation.</p>
            <Button className="mt-4 w-fit" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download Script
            </Button>
          </div>
        );
      // case 10:
      //   return (
      //     <div className="gap-4 flex flex-col">
      //       <h2 className="text-2xl font-bold mb-2">Review</h2>
      //       <p>Review your simulation settings before final submission.</p>
      //       <CodeBlock />
      //     </div>
      //   );
      // case 11:
      //   return (
      //     <div className="gap-4 flex flex-col">
      //       <h2 className="text-2xl font-bold mb-2">Confirmation</h2>
      //       <p>Confirm and submit your simulation.</p>
      //       <CodeBlock />
      //     </div>
      //   );
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
        <Button onClick={handleNext}>
          {currentStep === totalSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
