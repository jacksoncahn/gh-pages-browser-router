import { useId } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'

interface ControlledComboboxProps {
  label: string
  items: string[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  horizontal?: boolean
}

/**
 * A controlled combobox component with a label.
 * Wraps the base Combobox component with consistent styling and behavior.
 */
export function ControlledCombobox({
  label,
  items,
  value,
  onChange,
  placeholder,
  horizontal = false
}: ControlledComboboxProps) {
  const inputId = useId()

  return (
    <div className={`flex ${horizontal ? 'flex-row items-center' : 'flex-col'} gap-2`}>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <Combobox items={items} value={value ?? null} onValueChange={val => val && onChange(val)}>
        <ComboboxInput id={inputId} placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {item => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
