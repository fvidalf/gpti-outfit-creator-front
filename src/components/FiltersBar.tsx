import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { GenderFilter, SizeSchemaOption } from "@/types/domain"

interface FiltersBarProps {
  categories: string[]
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
  sizeSchemas: SizeSchemaOption[]
  selectedSizeFilters: Record<string, string[]>
  onToggleSize: (schemaId: string, size: string) => void
  gender: GenderFilter | ""
  genderOptions?: GenderFilter[]
  onSelectGender: (gender: GenderFilter) => void
  priceMin: string
  priceMax: string
  onPriceChange: (min: string, max: string) => void
}

const buttonBase =
  "px-3 py-1.5 text-sm font-medium rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
const unselectedButton = `${buttonBase} bg-transparent text-gray-800 hover:text-black`
const selectedButton = `${buttonBase} bg-black text-white`

export function FiltersBar({
  categories,
  selectedCategories,
  onToggleCategory,
  sizeSchemas,
  selectedSizeFilters,
  onToggleSize,
  gender,
  genderOptions,
  onSelectGender,
  priceMin,
  priceMax,
  onPriceChange,
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(true)
  const [showCategories, setShowCategories] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showPrice, setShowPrice] = useState(false)

  const genderList: GenderFilter[] = useMemo(
    () => (genderOptions?.length ? genderOptions : ["female", "male", "any", "kids"]),
    [genderOptions],
  )

  return (
    <div className="max-w-5xl mx-auto mb-8 space-y-3">
      <button
        onClick={() => setShowFilters((v) => !v)}
        className="flex items-center gap-2 text-base md:text-lg text-gray-900 hover:text-black tracking-wide"
      >
        Filtrar {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showFilters && (
        <>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-900">Sección</div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {genderList.map((value) => (
                <button
                  key={value}
                  onClick={() => onSelectGender(value)}
                  className={gender === value ? selectedButton : unselectedButton}
                >
                  {value === "female" ? "Mujer" : value === "male" ? "Hombre" : value === "kids" ? "Niños" : "Unisex"}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowCategories((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black"
              >
                Categorías {showCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showCategories && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const selected = selectedCategories.includes(category)
                    return (
                      <button
                        key={category}
                        onClick={() => onToggleCategory(category)}
                        className={selected ? selectedButton : unselectedButton}
                      >
                        {category}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => setShowPrice((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black"
            >
              Precio {showPrice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showPrice && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase">Min</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceMin}
                    onChange={(e) => onPriceChange(e.target.value, priceMax)}
                    className="w-28 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent px-1 py-1 text-sm"
                    placeholder="0"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase">Max</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceMax}
                    onChange={(e) => onPriceChange(priceMin, e.target.value)}
                    className="w-28 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent px-1 py-1 text-sm"
                    placeholder="∞"
                  />
                </label>
              </div>
            )}
          </div>

          {sizeSchemas.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowSizes((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black"
              >
                Tallas {showSizes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showSizes && (
                <div className="space-y-2">
                  {sizeSchemas.map((schema) => (
                    <div key={schema.id} className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{schema.label}</span>
                      <div className="flex flex-wrap gap-2">
                        {schema.sizes.map((size) => {
                          const selected = selectedSizeFilters[schema.id]?.includes(size)
                          return (
                            <button
                              key={`${schema.id}-${size}`}
                              onClick={() => onToggleSize(schema.id, size)}
                              className={selected ? selectedButton : unselectedButton}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
