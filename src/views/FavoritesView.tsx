import { ArrowLeft, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import type { LikedItem } from "@/types/domain"

interface FavoritesViewProps {
  items: LikedItem[]
  onClose: () => void
  onRemove: (itemId: string, size: string) => void
  onMoveToCart: (item: LikedItem) => void
}

export function FavoritesView({ items, onClose, onRemove, onMoveToCart }: FavoritesViewProps) {
  return (
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto" style={{ top: "64px" }}>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-2xl font-bold">Mis Prendas Favoritas ❤️</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-4">No tienes prendas favoritas</h2>
            <p className="text-gray-600 mb-8">Agrega algunas prendas increíbles a tus favoritos</p>
            <Button onClick={onClose} className="bg-black hover:bg-gray-800 text-white px-8 py-3">
              Seguir Comprando
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <Card key={`${item.itemId}-${item.size}-${index}`} className="border-0 rounded-none shadow-none flex flex-col h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <img src={item.photoUrl} alt={item.name} className="w-full aspect-square object-cover" />
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="font-normal text-sm uppercase">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Talla: {item.size}</p>
                      <h3 className="font-bold text-sm mb-2">${formatPrice(item.price)}</h3>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => onMoveToCart(item)}
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-none py-3 font-medium uppercase tracking-wide"
                      >
                        Agregar al carrito
                      </Button>
                      <Button
                        onClick={() => onRemove(item.itemId, item.size)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 rounded-none py-3 font-medium"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
