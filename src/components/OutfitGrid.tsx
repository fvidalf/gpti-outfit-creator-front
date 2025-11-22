import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import type { ProductCardData } from "@/types/domain"

interface OutfitGridProps {
  items: ProductCardData[]
  selectedSizes: Record<string, string>
  recentlyLiked: Record<string, boolean>
  onSelectSize: (itemId: string, size: string) => void
  onAddToCart: (item: ProductCardData) => void
  onAddToLiked: (item: ProductCardData) => void
  isItemLiked: (itemId: string, size: string) => boolean
}

export function OutfitGrid({
  items,
  selectedSizes,
  recentlyLiked,
  onSelectSize,
  onAddToCart,
  onAddToLiked,
  isItemLiked,
}: OutfitGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {items.map((item) => {
        const selectedSize = selectedSizes[item.id]
        const liked = selectedSize ? isItemLiked(item.id, selectedSize) : false
        const isRecentlyLiked = recentlyLiked[item.id]

        return (
          <Card key={item.id} className="border-0 rounded-none shadow-none flex flex-col h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <img src={item.photoUrl} alt={item.comment || item.name} className="w-full aspect-square object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="font-normal text-sm uppercase">{item.name}</h3>
                  <h3 className="font-bold text-sm mb-2">${formatPrice(item.price)}</h3>
                  {item.comment && <p className="text-gray-600 text-sm h-12 overflow-hidden">{item.comment}</p>}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 uppercase">Talla</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.sizes.map((size) => {
                      const isUnavailable = item.unavailableSizes.includes(size)
                      const isAvailable = item.availableSizes.length ? item.availableSizes.includes(size) : !isUnavailable
                      const isSelected = selectedSizes[item.id] === size
                      const disabled = !isAvailable || isUnavailable

                      return (
                        <button
                          key={size}
                          onClick={() => onSelectSize(item.id, size)}
                          disabled={disabled}
                          aria-disabled={disabled}
                          className={`px-3 py-1 border text-sm font-medium transition-colors ${
                            disabled
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : isSelected
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedSize && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onAddToCart(item)}
                      className="flex-1 bg-black hover:bg-gray-800 text-white rounded-none py-3 font-medium uppercase tracking-wide"
                    >
                      Agregar al carrito
                    </Button>
                    <Button
                      onClick={() => onAddToLiked(item)}
                      className={`rounded-none py-3 font-medium transition-all duration-300 ${
                        liked || isRecentlyLiked
                          ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                          : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                      }`}
                      variant="outline"
                    >
                      ❤️
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
