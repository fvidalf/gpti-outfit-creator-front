import { Button } from "@/components/ui/button"
import type { GenderFilter } from "@/types/domain"

interface GenderSelectorProps {
  selectedGender: GenderFilter | ""
  onSelect: (gender: GenderFilter) => void
}

const OPTIONS: { label: string; value: GenderFilter }[] = [
  { label: "Mujer", value: "female" },
  { label: "Hombre", value: "male" },
  { label: "Unisex", value: "any" },
]

export function GenderSelector({ selectedGender, onSelect }: GenderSelectorProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`rounded-lg px-6 py-2 font-medium border-4 border-gradient transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${
            selectedGender === option.value
              ? "bg-black text-white border-black shadow-lg scale-105"
              : "bg-gray-50 text-black border-gray-300 hover:bg-gray-100"
          }`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
