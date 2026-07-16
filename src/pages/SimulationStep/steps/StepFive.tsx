import { Input } from '@/components/ui/input'
import { useSimulation } from '@/hooks/useSimulation'
import { ControlledCombobox } from '@/components/shared/ControlledCombobox'
import { CodeBlock } from '@/components/shared/CodeBlock'
import {
  PositiveIonTypes,
  NegativeIonTypes,
  type PositiveIonType,
  type NegativeIonType,
  SolventGroups
} from '@/types/simulation.types'
import { generateStepCommand } from '@/utils/gromacs.utils'
import { STEP_CONFIG } from '@/constants/simulation.constants'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { MaxWarnings } from '@/components/simulation/max-warnings'

/**
 * Step Five: Ionization
 * Users select positive and negative ions to neutralize the system
 * and specify the solvent group and ion concentration
 */
export default function StepFive() {
  const simulation = useSimulation()
  const params = simulation.currentSimulation?.simulation_params
  const { title, description } = STEP_CONFIG[5]

  const isNeutralizeChecked = Boolean(params?.neutralizeSystem)
  const isIonWarningEnabled = Boolean(params?.enableMaxIonsWarning)

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <div className="flex flex-col items-center gap-8 mt-4">
        {/* Ion Type Selection */}
        <div className="flex flex-row gap-4">
          <ControlledCombobox
            label="Positive Ion"
            items={Object.values(PositiveIonTypes)}
            value={params?.positiveIon}
            onChange={value => simulation.updatePositiveIon(value as PositiveIonType)}
          />
          <ControlledCombobox
            label="Negative Ion"
            items={Object.values(NegativeIonTypes)}
            value={params?.negativeIon}
            onChange={value => simulation.updateNegativeIon(value as NegativeIonType)}
          />
        </div>

        {/* Solvent Group and Ion Concentration */}
        <div className="flex flex-row gap-4">
          <ControlledCombobox
            label="Solvent Group"
            items={Object.values(SolventGroups)}
            value={params?.solventGroup}
            onChange={value => simulation.updateSolventGroup(value as 'SOL')}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="ion-concentration" className="text-sm font-medium">
              Ion Concentration (M)
            </label>
            <Input
              id="ion-concentration"
              type="number"
              placeholder="e.g. 0.15"
              step="0.05"
              min="0"
              value={params?.ionConcentration ?? ''}
              onChange={e => {
                const value = e.target.value
                simulation.updateIonConcentration(value === '' ? null : parseFloat(value))
              }}
            />
          </div>
        </div>

        <FieldGroup className="mt-1">
          <Field orientation="horizontal" className="w-fit mx-auto items-center justify-center gap-3">
            <Checkbox
              id="neutralize-ions"
              name="neutralize-ions"
              checked={isNeutralizeChecked}
              onCheckedChange={checked => {
                const isChecked = checked === true
                simulation.updateNeutralizeSystem(isChecked)
              }}
            />
            <FieldLabel htmlFor="neutralize-ions" className="flex-none! text-center leading-snug">
              Neutralize the system
            </FieldLabel>
          </Field>
        </FieldGroup>

        <MaxWarnings
          enabled={isIonWarningEnabled}
          value={params?.maxIonWarnings ?? null}
          onEnabledChange={enabled => simulation.updateEnableMaxIonsWarning(enabled)}
          onValueChange={value => simulation.updateIonMaxWarnings(value)}
        />
      </div>

      <CodeBlock code={generateStepCommand(5, simulation.currentSimulation?.simulation_params)} />
    </div>
  )
}
