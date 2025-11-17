import { ShoppingBag } from "lucide-react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationBarProps {
  cartCount: number
  onReset: () => void
  onOpenCart: () => void
  onOpenFavorites: () => void
}

export function NavigationBar({
  cartCount,
  onReset,
  onOpenCart,
  onOpenFavorites,
}: NavigationBarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white z-40 relative">
      <div className="flex items-center gap-8">
        <Menu className="w-6 h-6" />
        <div className="flex gap-8 text-gray-600 font-medium">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
            onClick={onReset}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sparklesGradientNav" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5170ff" />
                  <stop offset="100%" stopColor="#ff66c4" />
                </linearGradient>
              </defs>
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
                fill="url(#sparklesGradientNav)"
              />
            </svg>
            <span className="text-purple-500 font-medium">¿QUÉ BUSCAS?</span>
          </button>
          <Button
            variant="ghost"
            className="text-purple-500 font-medium p-0 hover:text-purple-700"
            onClick={onOpenFavorites}
          >
            ❤️
          </Button>
        </div>
      </div>
      <button
        onClick={onOpenCart}
        className="hover:text-black transition-colors flex items-center gap-1 relative"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  )
}
