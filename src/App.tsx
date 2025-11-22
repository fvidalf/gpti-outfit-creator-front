import { useEffect, useMemo, useState } from "react"
import { NavigationBar } from "@/components/NavigationBar"
import { OutfitCarousel } from "@/components/OutfitCarousel"
import { OutfitGrid } from "@/components/OutfitGrid"
import { FiltersBar } from "@/components/FiltersBar"
import { PromptForm } from "@/components/PromptForm"
import { StatusMessage } from "@/components/StatusMessage"
import { SuccessToast } from "@/components/SuccessToast"
import { mockCatalog, mockOutfitCarousel } from "@/mocks/outfit"
import type {
  CartLineItem,
  GenderFilter,
  FiltersResponse,
  ItemDetail,
  LikedItem,
  OutfitResponse,
  ProductCardData,
  SizeSchemaOption,
} from "@/types/domain"
import { CartView } from "@/views/CartView"
import { FavoritesView } from "@/views/FavoritesView"
import { apiService } from "@/lib/api"

type ViewState = "main" | "cart" | "favorites"
const mockCatalogMap = new Map(mockCatalog.map((item) => [item.item_id, item]))

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
  const [itemDetailsById, setItemDetailsById] = useState<Record<string, ItemDetail>>({})
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizeFilters, setSelectedSizeFilters] = useState<Record<string, string[]>>({})

  const productCards: ProductCardData[] = useMemo(() => {
    if (!outfitResponse) return []

    return outfitResponse.outfitSuggestions.map((suggestion) => {
      const catalog = itemDetailsById[suggestion.itemId] || mockCatalogMap.get(suggestion.itemId)
      const availableSizes = catalog?.availableSizes ?? catalog?.sizes ?? []
      const unavailableSizes = catalog?.unavailableSizes ?? []
      return {
        id: suggestion.itemId,
        name: suggestion.itemName || catalog?.name || suggestion.itemId,
        price: catalog?.price ?? 0,
        sizes: catalog?.sizes ?? [],
        photoUrl: catalog?.photo_url || "",
        comment: suggestion.comment,
        availableSizes,
        unavailableSizes,
      }
    })
  }, [itemDetailsById, outfitResponse])

  const visibleSizeSchemas: SizeSchemaOption[] = useMemo(() => {
    const schemas = filtersData?.sizeSchemas ?? []
    if (!gender) return schemas
    const isKids = gender === "kids"
    return schemas.filter((schema) => (isKids ? schema.id.startsWith("kids_") : !schema.id.startsWith("kids_")))
  }, [filtersData, gender])

  useEffect(() => {
    apiService
      .fetchFilters()
      .then((data) => setFiltersData(data))
      .catch((err) => console.error("Failed to fetch filters", err))
  }, [])

  useEffect(() => {
    if (!gender) return
    const isKids = gender === "kids"
    setSelectedSizeFilters((prev) => {
      const nextEntries = Object.entries(prev).filter(([schemaId]) =>
        isKids ? schemaId.startsWith("kids_") : !schemaId.startsWith("kids_"),
      )
      return Object.fromEntries(nextEntries)
    })
  }, [gender])

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

    if (item.unavailableSizes.includes(size)) {
      alert("Esa talla no está disponible")
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

    if (item.unavailableSizes.includes(size)) {
      alert("Esa talla no está disponible")
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

    try {
      const payload = {
        prompt,
        gender: gender || undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
        sizeFilters: Object.keys(selectedSizeFilters).length ? selectedSizeFilters : undefined,
      }

      const outfit = await apiService.generateOutfit(payload)

      const itemIds = outfit.outfitSuggestions.map((item) => item.itemId)
      const fetchedCatalog = await apiService.fetchItemsByIds(itemIds)

      setItemDetailsById((prev) => {
        const next = { ...prev }
        fetchedCatalog.forEach((item) => {
          next[item.item_id] = item
        })
        return next
      })

      setOutfitResponse(outfit)
      setSelectedSizes({})
      setView("main")
    } catch (error) {
      console.error("Failed to generate outfit", error)
      alert("No pudimos generar el outfit. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
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
          <FiltersBar
            categories={filtersData?.categories ?? []}
            selectedCategories={selectedCategories}
            onToggleCategory={(category) =>
              setSelectedCategories((prev) =>
                prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
              )
            }
            sizeSchemas={visibleSizeSchemas}
            selectedSizeFilters={selectedSizeFilters}
            onToggleSize={(schemaId, size) =>
              setSelectedSizeFilters((prev) => {
                const current = prev[schemaId] ?? []
                const exists = current.includes(size)
                const nextSizes = exists ? current.filter((s) => s !== size) : [...current, size]
                const next = { ...prev }
                if (nextSizes.length) {
                  next[schemaId] = nextSizes
                } else {
                  delete next[schemaId]
                }
                return next
              })
            }
            gender={gender}
            genderOptions={filtersData?.genders}
            onSelectGender={setGender}
          />

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
    </div>
  )
}

export default App
