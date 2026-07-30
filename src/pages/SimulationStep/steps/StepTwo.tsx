import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'
import { useSimulation } from '@/hooks/useSimulation'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { generateStepCommand } from '@/utils/gromacs.utils'
import { downloadPDBFile } from '@/utils/download.utils'
import { isValidPDBId } from '@/utils/simulation.utils'
import { usePDBLookup } from '@/hooks/usePDBLookup'
import { STEP_CONFIG } from '@/constants/simulation.constants'
import type { ProteinMetadata } from '@/types/simulation.types'

/**
 * Step Two: Protein Selection
 * Users enter a PDB ID and look up protein metadata from RSCB database
 * Can download the protein structure file and optionally remove structural waters
 */
export default function StepTwo() {
  const simulation = useSimulation()
  const params = simulation.currentSimulation?.simulation_params
  const { title, description } = STEP_CONFIG[2]

  const { handlePDBLookup, lookupStatus, lookupError } = usePDBLookup()
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const currentStep = 2

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {/* PDB ID Input and Search */}
        <Field orientation="horizontal">
          <Input
            placeholder="e.g. 1AKI"
            className="mt-2"
            value={params?.proteinId || ''}
            onChange={e => {
              simulation.updateProteinId(e.target.value.toUpperCase())
              if (lookupStatus === 'success') {
                simulation.updateProteinMetadata(null)
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handlePDBLookup()
              }
            }}
          />
          <Button onClick={handlePDBLookup}>{lookupStatus === 'loading' ? 'Loading...' : 'Search'}</Button>
        </Field>

        {/* Metadata Display */}
        {lookupStatus === 'success' && params?.proteinMetadata && (
          <PDBMetadataDisplay metadata={params?.proteinMetadata} />
        )}

        {/* Error States */}
        {lookupStatus === 'error' && (
          <p className="text-sm text-destructive">{lookupError || 'Failed to fetch protein metadata.'}</p>
        )}

        {/* Download PDB File */}
        <Button
          variant={lookupStatus === 'success' ? 'default' : 'outline'}
          onClick={() => {
            const success = downloadPDBFile(params?.proteinId || '')
            setDownloadError(success ? null : 'Unable to download PDB file. Check the PDB ID and try again.')
          }}
          disabled={!isValidPDBId(params?.proteinId || '') || lookupStatus !== 'success'}
          className="w-full mt-2"
        >
          <Download className="mr-2 h-4 w-4" />
          Download {params?.proteinId?.toUpperCase() || 'PDB'} File
        </Button>

        {downloadError && <p className="text-sm text-destructive">{downloadError}</p>}

        {/* Clean Protein Option */}
        <FieldGroup className="mt-2">
          <Field orientation="horizontal" className="justify-center">
            <Checkbox
              id="clean-protein"
              name="clean-protein"
              onCheckedChange={simulation.updateCleanProtein}
              checked={Boolean(params?.cleanProtein)}
            />
            <FieldLabel htmlFor="clean-protein" className="flex-none!">
              Remove structural waters from protein
            </FieldLabel>
          </Field>
        </FieldGroup>
      </div>
      <CodeBlock code={generateStepCommand(currentStep, simulation.currentSimulation?.simulation_params)} />
    </div>
  )
}

/**
 * PDBMetadataDisplay: Subcomponent to display protein metadata from RSCB
 * Shows atom count, molecular weight, experimental method, DOI, release date, and keywords
 */
function PDBMetadataDisplay({ metadata }: { metadata: ProteinMetadata }) {
  return (
    <div className="flex flex-col rounded-md p-4 items-center gap-2 bg-card mt-4">
      <p className="font-bold">{metadata.title}</p>

      <div className="text-muted-foreground gap-1.5">
        <p>
          <strong>Atom Count:</strong> {metadata.deposited_atom_count ?? '—'}
        </p>
        <p>
          <strong>Total Structure Weight: </strong>
          {metadata.molecular_weight != null ? `${metadata.molecular_weight} kDa` : '—'}
        </p>
        <p>
          <strong>Experimental Method: </strong>
          {metadata.experimental_method ?? '—'}
        </p>
        <div className="flex items-center gap-1">
          <strong>DOI: </strong>
          {metadata.pdbx_database_id_DOI ? (
            <a
              href={`https://doi.org/${metadata.pdbx_database_id_DOI}`}
              className="text-link underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {metadata.pdbx_database_id_DOI}
            </a>
          ) : (
            <p>No DOI included</p>
          )}
        </div>
        <p>
          <strong>Release Date: </strong>
          {metadata.initial_release_date
            ? new Date(metadata.initial_release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : '—'}
        </p>
        <p>
          <strong>Keywords: </strong>
          {metadata.pdbx_keywords ?? 'No keywords'}
        </p>
      </div>
    </div>
  )
}
