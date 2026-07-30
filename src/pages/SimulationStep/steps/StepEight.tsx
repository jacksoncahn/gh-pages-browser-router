import { useSimulation } from '@/hooks/useSimulation'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { generateStepCommand } from '@/utils/gromacs.utils'
import { STEP_CONFIG } from '@/constants/simulation.constants'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * Step Eight: System Validation
 * Users select which system properties to validate after equilibration
 * Options include temperature, pressure, and system volume
 */
export default function StepEight() {
  const simulation = useSimulation()
  const params = simulation.currentSimulation?.simulation_params
  const showCodeBlock =
    params?.verificationParams?.temperature ||
    params?.verificationParams?.pressure ||
    params?.verificationParams?.system_volume
  const { title, description } = STEP_CONFIG[8]

  return (
    <div className="gap-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
      <FieldGroup className="mt-4 gap-3">
        {/* Temperature Validation */}
        <Field orientation="horizontal" className="w-fit mx-auto justify-center">
          <Checkbox
            id="verify-temperature"
            name="verify-temperature"
            checked={params?.verificationParams?.temperature || false}
            onCheckedChange={checked => simulation.updateVerification('temperature', checked === true)}
          />
          <FieldLabel htmlFor="verify-temperature" className="flex-none! whitespace-nowrap">
            Temperature
          </FieldLabel>
        </Field>

        {/* Pressure Validation */}
        <Field orientation="horizontal" className="w-fit mx-auto justify-center">
          <Checkbox
            id="verify-pressure"
            name="verify-pressure"
            checked={params?.verificationParams?.pressure || false}
            onCheckedChange={checked => simulation.updateVerification('pressure', checked === true)}
          />
          <FieldLabel htmlFor="verify-pressure" className="flex-none! whitespace-nowrap">
            Pressure
          </FieldLabel>
        </Field>

        {/* System Volume Validation */}
        <Field orientation="horizontal" className="w-fit mx-auto justify-center">
          <Checkbox
            id="verify-system-volume"
            name="verify-system-volume"
            checked={params?.verificationParams?.system_volume || false}
            onCheckedChange={checked => simulation.updateVerification('system_volume', checked === true)}
          />
          <FieldLabel htmlFor="verify-system-volume" className="flex-none! whitespace-nowrap">
            System Volume
          </FieldLabel>
        </Field>
      </FieldGroup>

      {showCodeBlock && <CodeBlock code={generateStepCommand(8, simulation.currentSimulation?.simulation_params)} />}
    </div>
  )
}
