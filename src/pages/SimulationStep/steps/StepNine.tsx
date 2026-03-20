import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useSimulation } from "@/contexts/SimulationContext";
import { generateCompleteBashScript } from "@/utils/gromacs.utils";
import { copyToClipboard, downloadTextFile } from "@/utils/download.utils";
import { STEP_CONFIG } from "@/constants/simulation.constants";

/**
 * Step Nine: Review and Submit
 * Final step where users review all simulation settings
 * Users can download or copy the complete GROMACS bash script
 */
export default function StepNine() {
  const simulation = useSimulation();
  const { title, description } = STEP_CONFIG[9];
  const [copied, setCopied] = useState(false);

  /**
   * Copy the bash script to clipboard
   */
  const handleCopyBashScript = async () => {
    const script = generateCompleteBashScript(simulation.currentSimulation);
    const success = await copyToClipboard(script);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Download the bash script as a .sh file
   */
  const handleDownloadBashScript = () => {
    const script = generateCompleteBashScript(simulation.currentSimulation);
    const simName = simulation.currentSimulation?.simName || "simulation";
    const filename = `${simName.replace(/\s+/g, "_")}_gromacs.sh`;
    downloadTextFile(script, filename);
  };

  return (
    <div className="gap-4 flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-center">{description}</p>

      {/* Complete Script Display */}
      <div className="mt-6 w-full">
        <h3 className="font-semibold mb-2">Complete GROMACS Script</h3>
        <div className="relative flex flex-col gap-2">
          {/* Bash Script Preview */}
          <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word max-h-72 overflow-y-auto text-left">
            <code className="text-xs">
              {generateCompleteBashScript(simulation.currentSimulation)}
            </code>
          </pre>

          {/* Copy and Download Buttons */}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={handleCopyBashScript}>
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
}
