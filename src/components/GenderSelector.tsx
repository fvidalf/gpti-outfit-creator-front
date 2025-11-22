import { Button } from "@/components/ui/button"
import type { GenderFilter } from "@/types/domain"

interface GenderSelectorProps {
  selectedGender: GenderFilter | ""
  onSelect: (gender: GenderFilter) => void
  options?: GenderFilter[]
}

const LABELS: Record<GenderFilter, string> = {
  female: "Mujer",
  male: "Hombre",
  any: "Unisex",
  kids: "Niños",
}

const DEFAULT_OPTIONS: GenderFilter[] = ["female", "male", "any", "kids"]

export function GenderSelector({ selectedGender, onSelect, options }: GenderSelectorProps) {
  const optionValues = options?.length ? options : DEFAULT_OPTIONS

  return (
    <div className="flex justify-center gap-4 mt-6">
      {optionValues.map((value) => (
        <Button
          key={value}
          onClick={() => onSelect(value)}
          className={`rounded-lg px-6 py-2 font-medium border-4 border-gradient transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${
            selectedGender === value
              ? "bg-black text-white border-black shadow-lg scale-105"
              : "bg-gray-50 text-black border-gray-300 hover:bg-gray-100"
          }`}
        >
          {LABELS[value]}
        </Button>
      ))}
    </div>
  )
}
