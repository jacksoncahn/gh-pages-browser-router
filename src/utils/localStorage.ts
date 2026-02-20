import type { Simulation } from "@/types/simulation.types";

const SIMULATIONS_KEY = 'gromacs-simulations';

export const getAllSimulations = (): Simulation[] => {
    try {
        const stored = localStorage.getItem(SIMULATIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load simulations from localStorage:', error);
        return [];
    }
};

export const getSimulationById = (id: number): Simulation | null => {
    const simulations = getAllSimulations();
    return simulations.find(sim => sim.id === id) || null;
};

export const saveSimulation = (simulation: Simulation): void => {
    try {
        const simulations = getAllSimulations();
        const existingIndex = simulations.findIndex(sim => sim.id === simulation.id);

        if (existingIndex >= 0) {
            simulations[existingIndex] = simulation;
        } else {
            simulations.push(simulation);
        }

        localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(simulations));
    } catch (error) {
        console.error('Failed to save simulation to localStorage:', error);
    }
};

export const deleteSimulation = (id: number): void => {
    try {
        const simulations = getAllSimulations();
        const filtered = simulations.filter(sim => sim.id !== id);
        localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete simulation from localStorage:', error);
    }
};

export const generateSimulationId = (): number => {
    const simulations = getAllSimulations();
    if (simulations.length === 0) return 1;
    return Math.max(...simulations.map(sim => sim.id)) + 1;
};
