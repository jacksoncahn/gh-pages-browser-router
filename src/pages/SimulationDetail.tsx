import { NavBar } from "@/components/shared/nav-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Copy, Download } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getSimulationById } from "@/utils/simulation.utils";
import { generateCompleteBashScript } from "@/utils/gromacs.utils";
import { downloadTextFile, copyToClipboard } from "@/utils/download.utils";
import type { Simulation } from "@/types/simulation.types";

export default function SimulationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const sim = getSimulationById(parseInt(id));
      setSimulation(sim);
    }
  }, [id]);

  const handleCopyScript = async () => {
    const script = generateCompleteBashScript(simulation, false);
    const success = await copyToClipboard(script);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadBashScript = () => {
    const script = generateCompleteBashScript(simulation, false);
    const simName = simulation?.simName || "simulation";
    const filename = `${simName.replace(/\s+/g, "_")}_gromacs.sh`;
    downloadTextFile(script, filename);
  };

  if (!simulation) {
    return (
      <main>
        <NavBar />
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-lg">Simulation not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft />
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  const params = simulation.simulation_params;

  return (
    <main className="py-4">
      <NavBar />

      <div className="flex flex-col items-start px-[5%]">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{simulation.simName}</h1>
            <Badge
              variant={
                simulation.status === "complete" ? "default" : "secondary"
              }
            >
              {simulation.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {new Date(simulation.created_at).toLocaleString()}
          </p>
        </div>

        {/* Simulation Configuration */}
        <div className="w-full py-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Simulation Configuration
          </h2>
          <div className="grid grid-cols-2 gap-4 bg-card rounded-lg p-6 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Protein ID</p>
              <p className="font-medium">{params?.proteinId || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Force Field</p>
              <p className="font-medium">{params?.forceField || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Water Model</p>
              <p className="font-medium">{params?.waterModel || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Box Type</p>
              <p className="font-medium">{params?.boxType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Box Distance</p>
              <p className="font-medium">
                {(params as any)?.boxDistance
                  ? `${(params as any).boxDistance} units?`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ion Concentration</p>
              <p className="font-medium">
                {params?.ion_concentration
                  ? `${params.ion_concentration} M`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Positive Ion</p>
              <p className="font-medium">{params?.positiveIon || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Negative Ion</p>
              <p className="font-medium">{params?.negativeIon || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solvent Group</p>
              <p className="font-medium">
                {(params as any)?.solventGroup || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equilibriation</p>
              <p className="font-medium">
                {(params as any)?.equilibriationOptions || "none"}
              </p>
            </div>
            {params?.verificationParams && (
              <div className="col-span-2 flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2 text-center">
                  Verification Parameters
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {params.verificationParams.temperature && (
                    <Badge variant="outline">Temperature</Badge>
                  )}
                  {params.verificationParams.pressure && (
                    <Badge variant="outline">Pressure</Badge>
                  )}
                  {params.verificationParams.system_volume && (
                    <Badge variant="outline">System Volume</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GROMACS Script */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">GROMACS Script</h2>
          <div className="relative flex flex-col gap-2">
            <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto text-left border">
              <code className="text-xs">
                {generateCompleteBashScript(simulation, false)}
              </code>
            </pre>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={handleCopyScript}>
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
    </main>
  );
}
