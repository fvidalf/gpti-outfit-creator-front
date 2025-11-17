import { useMemo, useState } from "react"
import { GenderSelector } from "@/components/GenderSelector"
import { NavigationBar } from "@/components/NavigationBar"
import { OutfitCarousel } from "@/components/OutfitCarousel"
import { OutfitGrid } from "@/components/OutfitGrid"
import { PromptForm } from "@/components/PromptForm"
import { StatusMessage } from "@/components/StatusMessage"
import { SuccessToast } from "@/components/SuccessToast"
import { mockCatalog, mockOutfitCarousel, mockOutfitResponse } from "@/mocks/outfit"
import type {
  CartLineItem,
  GenderFilter,
  LikedItem,
  OutfitResponse,
  ProductCardData,
} from "@/types/domain"
import { CartView } from "@/views/CartView"
import { FavoritesView } from "@/views/FavoritesView"

type ViewState = "main" | "cart" | "favorites"

function App() {
  const [prompt, setPrompt] = useState("")
  const [gender, setGender] = useState<GenderFilter | "">("")
  const [outfitResponse, setOutfitResponse] = useState<OutfitResponse | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [cartItems, setCartItems] = useState<CartLineItem[]>([])
  const [likedItems, setLikedItems] = useState<LikedItem[]>([])
  const [view, setView] = useState<ViewState>("main")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyLiked, setRecentlyLiked] = useState<Record<string, boolean>>({})

  const productCards: ProductCardData[] = useMemo(() => {
    if (!outfitResponse) return []

    const catalogMap = new Map(mockCatalog.map((item) => [item.item_id, item]))

    return outfitResponse.outfitSuggestions.map((suggestion) => {
      const catalog = catalogMap.get(suggestion.itemId)
      return {
        id: suggestion.itemId,
        name: suggestion.itemName || catalog?.name || suggestion.itemId,
        price: catalog?.price ?? 0,
        sizes: catalog?.sizes ?? [],
        photoUrl: catalog?.photo_url || "",
        comment: suggestion.comment,
      }
    })
  }, [outfitResponse])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const isItemLiked = (itemId: string, size: string) =>
    likedItems.some((item) => item.itemId === itemId && item.size === size)

  const handleSelectSize = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }))
  }

  const handleAddToCart = (item: ProductCardData) => {
    const size = selectedSizes[item.id]
    if (!size) {
      alert("Por favor selecciona una talla")
      return
    }

    const existingItem = cartItems.find((cartItem) => cartItem.itemId === item.id && cartItem.size === size)

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.itemId === item.id && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      )
    } else {
      const newItem: CartLineItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        photoUrl: item.photoUrl,
        size,
        quantity: 1,
      }
      setCartItems((prev) => [...prev, newItem])
    }

    triggerToast()
  }

  const handleAddToLiked = (item: ProductCardData) => {
    const size = selectedSizes[item.id]
    if (!size) {
      alert("Por favor selecciona una talla")
      return
    }

    const exists = likedItems.some((liked) => liked.itemId === item.id && liked.size === size)
    if (exists) return

    const liked: LikedItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      photoUrl: item.photoUrl,
      size,
    }

    setLikedItems((prev) => [...prev, liked])
    setRecentlyLiked((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => setRecentlyLiked((prev) => ({ ...prev, [item.id]: false })), 2000)
    triggerToast()
  }

  const handleRemoveFromLiked = (itemId: string, size: string) => {
    setLikedItems((prev) => prev.filter((item) => !(item.itemId === itemId && item.size === size)))
  }

  const handleRemoveFromCart = (itemId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.itemId === itemId && item.size === size)))
  }

  const handleUpdateQuantity = (itemId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId, size)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId && item.size === size ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  const handleMoveToLikedFromCart = (cartItem: CartLineItem) => {
    const exists = likedItems.some((item) => item.itemId === cartItem.itemId && item.size === cartItem.size)
    if (!exists) {
      const liked: LikedItem = {
        itemId: cartItem.itemId,
        name: cartItem.name,
        price: cartItem.price,
        photoUrl: cartItem.photoUrl,
        size: cartItem.size,
      }
      setLikedItems((prev) => [...prev, liked])
    }
    handleRemoveFromCart(cartItem.itemId, cartItem.size)
    triggerToast()
  }

  const handleMoveToCartFromLiked = (likedItem: LikedItem) => {
    const existing = cartItems.find(
      (cartItem) => cartItem.itemId === likedItem.itemId && cartItem.size === likedItem.size,
    )

    if (existing) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.itemId === likedItem.itemId && cartItem.size === likedItem.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      )
    } else {
      const newItem: CartLineItem = {
        itemId: likedItem.itemId,
        name: likedItem.name,
        price: likedItem.price,
        photoUrl: likedItem.photoUrl,
        size: likedItem.size,
        quantity: 1,
      }
      setCartItems((prev) => [...prev, newItem])
    }

    setLikedItems((prev) => prev.filter((item) => !(item.itemId === likedItem.itemId && item.size === likedItem.size)))
    triggerToast()
  }

  const handleResetToMain = () => {
    setPrompt("")
    setGender("")
    setOutfitResponse(null)
    setSelectedSizes({})
    setView("main")
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)

    // TODO: Replace with real API call to /ai/generate-outfit when backend is connected
    setTimeout(() => {
      setOutfitResponse(mockOutfitResponse)
      setSelectedSizes({})
      setView("main")
      setIsLoading(false)
    }, 1200)
  }

  const triggerToast = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <SuccessToast visible={showSuccess} />

      <NavigationBar
        cartCount={cartCount}
        onReset={handleResetToMain}
        onOpenCart={() => setView("cart")}
        onOpenFavorites={() => setView("favorites")}
      />

      {view === "favorites" && (
        <FavoritesView
          items={likedItems}
          onClose={() => setView("main")}
          onRemove={handleRemoveFromLiked}
          onMoveToCart={handleMoveToCartFromLiked}
        />
      )}

      {view === "cart" && (
        <CartView
          items={cartItems}
          onClose={() => setView("main")}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onMoveToLiked={handleMoveToLikedFromCart}
          onOpenFavorites={() => setView("favorites")}
        />
      )}

      {view === "main" && (
        <main className="container mx-auto px-6 pt-12 pb-auto">
          <h1 className="wide-title text-left mb-12">ARMA TU OUTFIT</h1>

          <PromptForm prompt={prompt} isLoading={isLoading} onPromptChange={setPrompt} onSubmit={handleSubmit} />
          <GenderSelector selectedGender={gender} onSelect={setGender} />

          <StatusMessage
            isLoading={isLoading}
            hasResults={productCards.length > 0}
            conversationalMessage={outfitResponse?.conversationalResponse}
          />

          {productCards.length > 0 ? (
            <OutfitGrid
              items={productCards}
              selectedSizes={selectedSizes}
              recentlyLiked={recentlyLiked}
              onSelectSize={handleSelectSize}
              onAddToCart={handleAddToCart}
              onAddToLiked={handleAddToLiked}
              isItemLiked={isItemLiked}
            />
          ) : (
            <OutfitCarousel images={mockOutfitCarousel} />
          )}
        </main>
      )}

      <style>{`
        .outfit-carousel {
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        
        .outfit-carousel-track {
          display: flex;
          transition: transform 0.1s linear;
        }
        
        .outfit-image {
          flex-shrink: 0;
          width: 320px;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default App
