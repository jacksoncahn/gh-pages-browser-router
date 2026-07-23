import { Checkbox } from '../ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface MaxWarningsProps {
  enabled: boolean
  value: number | null
  onEnabledChange: (enabled: boolean) => void
  onValueChange: (value: number | null) => void
}

export function MaxWarnings({ enabled, value, onEnabledChange, onValueChange }: MaxWarningsProps) {
  return (
    <FieldGroup className="justify-center">
      <Field orientation="horizontal" className="w-lg mx-auto items-start gap-x-3">
        <Checkbox
          id="max-warnings"
          name="max-warnings"
          checked={enabled}
          className="mt-0.5"
          onCheckedChange={checked => {
            onEnabledChange(checked)
          }}
        />
        <FieldLabel htmlFor="max-warnings" className="min-w-0 flex-1 pr-6 text-left leading-snug">
          Bypass warnings to allow GROMACS to continue running despite potential issues
        </FieldLabel>
      </Field>
      {enabled && (
        <Field orientation="horizontal" className="w-fit mx-auto items-center gap-3 -mb-4 -mt-2">
          <FieldLabel htmlFor="max-warning-count" className="text-sm font-medium">
            Maximum warnings
          </FieldLabel>
          <Input
            id="max-warning-count"
            type="number"
            min={0}
            className="w-24"
            disabled={!enabled}
            value={value !== null ? value : 0}
            onChange={e => {
              const parsed = parseInt(e.target.value, 10)
              onValueChange(parsed >= 0 ? parsed : 0)
            }}
          />
        </Field>
      )}
    </FieldGroup>
  )
}
