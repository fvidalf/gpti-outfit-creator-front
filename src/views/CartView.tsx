import { ArrowLeft, Heart, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import type { CartLineItem, ItemDetail } from "@/types/domain"

interface CartViewProps {
  items: CartLineItem[]
  onClose: () => void
  onRemove: (itemId: string, size: string) => void
  onUpdateQuantity: (itemId: string, size: string, quantity: number) => void
  onMoveToLiked: (item: CartLineItem) => void
  onOpenFavorites: () => void
  itemDetailsById: Record<string, ItemDetail>
}

const calculateTotalItems = (items: CartLineItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0)

const calculateTotal = (items: CartLineItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)

export function CartView({
  items,
  onClose,
  onRemove,
  onUpdateQuantity,
  onMoveToLiked,
  onOpenFavorites,
  itemDetailsById,
}: CartViewProps) {
  return (
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto" style={{ top: "64px" }}>
      <div className="flex items-center p-6 gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="wide-title text-3xl uppercase text-left flex-1">Tu Carrito de Compras</h1>
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega algunos productos increíbles a tu carrito</p>
            <Button onClick={onClose} className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-none">
              Seguir Comprando
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 uppercase text-left">
                Productos en tu carrito ({calculateTotalItems(items)})
              </h2>
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={`${item.itemId}-${item.size}-${index}`}
                    className="grid grid-cols-[12rem_1fr] border items-stretch"
                  >
                    <div className="w-[12rem] h-[12rem] relative">
                      <img src={item.photoUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-normal text-sm uppercase mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-800 uppercase">Talla: {item.size}</p>
                          <p className="font-bold text-sm mt-1">${formatPrice(item.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onMoveToLiked(item)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                            title="Mover a favoritos"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onRemove(item.itemId, item.size)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4">
                          <span className="font-medium uppercase">Cantidad:</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onUpdateQuantity(item.itemId, item.size, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.itemId, item.size, item.quantity + 1)}
                              className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 ${
                                itemDetailsById[item.itemId]?.availability?.[item.size] !== undefined &&
                                item.quantity >= (itemDetailsById[item.itemId]?.availability?.[item.size] ?? 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm uppercase">Subtotal</p>
                          <p className="font-semibold text-lg">{`$${formatPrice(item.price * item.quantity)}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6 uppercase text-left">Resumen del Pedido</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold uppercase text-left">
                    <span>Total</span>
                    <span>${formatPrice(calculateTotal(items))}</span>
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 font-semibold text-lg rounded-none"
                >
                  Seguir Comprando
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
