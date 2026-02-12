export type Simulation = {
    //TODO: flesh this out with actual simulation type once that is firmed up
    id: number
    name: string
    proteinID: string
    status: 'paused' | 'running' | 'complete' | 'unknown'
}