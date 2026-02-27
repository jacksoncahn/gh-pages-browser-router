interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

/**
 * A checkbox component with an associated label.
 */
export function CheckboxItem({
  label,
  checked,
  onChange,
  id,
}: CheckboxItemProps) {
  const checkboxId = id || label;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300"
      />
      <label
        htmlFor={checkboxId}
        className="text-sm font-medium cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
