"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const proteins = [
  "collagen",
  "haemoglobin",
  "myoglobin",
  "lysozyme",
  "insulin",
] as const;

export function PDBCombobox() {
  return (
    
    <Combobox items={proteins}>
      <ComboboxInput placeholder="Select a protein" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
