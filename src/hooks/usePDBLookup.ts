import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext";
import { isValidPDBId, handlePDBLookupLogic } from "@/utils/simulation.utils";

type LookupStatus = "idle" | "loading" | "success" | "not_found" | "error";

/**
 * Custom hook for PDB metadata lookup
 * Handles state management for PDB lookup process including loading, success, and error states
 * Logic is delegated to simulation.utils for reusability
 */
export const usePDBLookup = () => {
    const simulation = useSimulation();
    const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
    const [lookupError, setLookupError] = useState<string | null>(null);

    /**
     * Perform PDB lookup with validation and metadata fetching
     */
    const handlePDBLookup = async () => {
        const params = simulation.currentSimulation?.simulation_params;
        const proteinId = (params?.proteinId || "").trim().toUpperCase();

        if (!isValidPDBId(proteinId)) {
            setLookupError(
                "Invalid PDB ID format. Should be 4 characters (e.g., 1AKI, 108D)."
            );
            setLookupStatus("error");
            return;
        }

        setLookupStatus("loading");
        setLookupError(null);

        const result = await handlePDBLookupLogic(proteinId, simulation);

        setLookupStatus(result.status);
        setLookupError(result.error);
    };

    return { lookupStatus, lookupError, handlePDBLookup };
};
