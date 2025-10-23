import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Menu, X, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react"

// Import outfit sample images
import outfit1 from '@/assets/samples/outfit1.png'
import outfit2 from '@/assets/samples/outfit2.png'
import outfit3 from '@/assets/samples/outfit3.png'
import outfit4 from '@/assets/samples/outfit4.png'
import outfit5 from '@/assets/samples/outfit5.png'
import outfit6 from '@/assets/samples/outfit6.png'

// Import outfit item images
import topImg from '@/assets/outfit/top.png'
import bottomImg from '@/assets/outfit/bottom.png'
import socksImg from '@/assets/outfit/socks.png'

// Types
interface CartItem {
  id: number
  src: string
  title: string
  price: number
  size: string
  quantity: number
}

interface ProductItem {
  id: number
  src: string
  comment: string
  title: string
  price: number
  sizes: string[]
}

interface LikedItem {
  id: number
  src: string
  title: string
  price: number
  size: string
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({})
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [likedItems, setLikedItems] = useState<LikedItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLikedOpen, setIsLikedOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [recentlyLiked, setRecentlyLiked] = useState<{[key: number]: boolean}>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  // Infinite scroll effect
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    let scrollAmount = 0
    const scrollSpeed = 0.2 // pixels per frame
    const imageWidth = 320 // Updated to match new w-80 class (320px) with no gaps
    const totalImages = 6 // Updated to match actual number of images
    const resetPoint = imageWidth * totalImages

    const scroll = () => {
      scrollAmount += scrollSpeed
      
      if (scrollAmount >= resetPoint) {
        scrollAmount = 0
      }
      
      scrollElement.style.transform = `translateX(-${scrollAmount}px)`
      requestAnimationFrame(scroll)
    }

    const animationId = requestAnimationFrame(scroll)
    
    return () => cancelAnimationFrame(animationId)
  }, [selectedItems.length]) // Re-run when state changes

  // Sample outfit images for the carousel
  const outfitImages = [
    { id: 1, src: outfit1, alt: 'Outfit 1' },
    { id: 2, src: outfit2, alt: 'Outfit 2' },
    { id: 3, src: outfit3, alt: 'Outfit 3' },
    { id: 4, src: outfit4, alt: 'Outfit 4' },
    { id: 5, src: outfit5, alt: 'Outfit 5' },
    { id: 6, src: outfit6, alt: 'Outfit 6' },
  ]

  // Create enough duplicates for seamless infinite scroll
  const infiniteImages = [
    ...outfitImages, 
    ...outfitImages
  ]

  // Mock selected items after AI response
  const mockSelectedItems = [
    {
      id: 1,
      src: topImg,
      comment: 'Un top suelto y cómodo perfecto para el calor',
      title: "Polera con motivo estampado Loose Fit",
      price: 8990,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      id: 2,
      src: bottomImg,
      comment: 'Los shorts que buscabas. Estos quedan perfectos con el conjunto',
      title: 'Shorts beige de algodón',
      price: 7990,
      sizes: ['28', '30', '32', '34', '36', '38'],
    },
    {
      id: 3,
      src: socksImg,
      comment: 'Calcetas que se lucen muy bien con pantalones cortos',
      title: 'Calcetas blancas deportivas',
      price: 3990,
      sizes: ['35-37', '38-40', '41-43', '44-46'],
    }
  ]

  // Function to format price with thousands separators (dots)
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Calculate total items in cart
  const calculateTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Calculate total price in cart
  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Check if item is liked
  const isItemLiked = (itemId: number, size: string): boolean => {
    return likedItems.some(item => item.id === itemId && item.size === size)
  }

  // Handle size selection
  const handleSizeSelect = (itemId: number, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }))
  }

  // Handle add to cart
  const handleAddToCart = (item: any) => {
    const selectedSize = selectedSizes[item.id]
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    const existingItem = cartItems.find(cartItem => 
      cartItem.id === item.id && cartItem.size === selectedSize
    )

    if (existingItem) {
      // Update quantity if item already exists
      setCartItems(prev => 
        prev.map(cartItem =>
          cartItem.id === item.id && cartItem.size === selectedSize
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: item.id,
        src: item.src,
        title: item.title,
        price: item.price,
        size: selectedSize,
        quantity: 1
      }
      setCartItems(prev => [...prev, newCartItem])
    }

    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  // Handle add to liked items
  const handleAddToLiked = (item: ProductItem) => {
    const selectedSize = selectedSizes[item.id]
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    const existingItem = likedItems.find(likedItem => 
      likedItem.id === item.id && likedItem.size === selectedSize
    )

    if (!existingItem) {
      // Add new item to liked
      const newLikedItem: LikedItem = {
        id: item.id,
        src: item.src,
        title: item.title,
        price: item.price,
        size: selectedSize
      }
      setLikedItems(prev => [...prev, newLikedItem])
      
      // Show visual feedback
      setRecentlyLiked(prev => ({ ...prev, [item.id]: true }))
      setTimeout(() => {
        setRecentlyLiked(prev => ({ ...prev, [item.id]: false }))
      }, 2000)
      
      // Show success message for liked item
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  // Handle add to liked from cart
  const handleAddToLikedFromCart = (cartItem: CartItem) => {
    const existingItem = likedItems.find(likedItem => 
      likedItem.id === cartItem.id && likedItem.size === cartItem.size
    )

    if (!existingItem) {
      // Add new item to liked
      const newLikedItem: LikedItem = {
        id: cartItem.id,
        src: cartItem.src,
        title: cartItem.title,
        price: cartItem.price,
        size: cartItem.size
      }
      setLikedItems(prev => [...prev, newLikedItem])
      
      // Remove from cart
      handleRemoveFromCart(cartItem.id, cartItem.size)
      
      // Show success message
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  // Handle add to cart from liked items
  const handleAddToCartFromLiked = (likedItem: LikedItem) => {
    const existingItem = cartItems.find(cartItem => 
      cartItem.id === likedItem.id && cartItem.size === likedItem.size
    )

    if (existingItem) {
      // Update quantity if item already exists
      setCartItems(prev => 
        prev.map(cartItem =>
          cartItem.id === likedItem.id && cartItem.size === likedItem.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: likedItem.id,
        src: likedItem.src,
        title: likedItem.title,
        price: likedItem.price,
        size: likedItem.size,
        quantity: 1
      }
      setCartItems(prev => [...prev, newCartItem])
    }

    // Remove from liked items
    setLikedItems(prev => prev.filter(item => 
      !(item.id === likedItem.id && item.size === likedItem.size)
    ))

    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  // Handle remove from liked items
  const handleRemoveFromLiked = (itemId: number, size: string) => {
    setLikedItems(prev => prev.filter(item => !(item.id === itemId && item.size === size)))
  }

  // Handle remove item from cart
  const handleRemoveFromCart = (itemId: number, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === itemId && item.size === size)))
  }

  // Handle update quantity
  const handleUpdateQuantity = (itemId: number, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId, size)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // Handle gender selection
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender)
  }

  // Handle reset to main page (without losing cart)
  const handleResetToMain = () => {
    setSelectedItems([])
    setPrompt('')
    setSelectedSizes({})
    setSelectedGender('')
    setIsLoading(false)
    setIsLikedOpen(false)
    setIsCartOpen(false)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      setTimeout(() => {
        setSelectedItems(mockSelectedItems)
        setIsLoading(false)
      }, 1500)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>¡Tu producto ha sido añadido exitosamente!</span>
        </div>
      )}

      {/* Navigation - SIEMPRE VISIBLE */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white z-40 relative">
        <div className="flex items-center gap-8">
          <Menu className="w-6 h-6" />
          <div className="flex gap-8 text-gray-600 font-medium">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleResetToMain}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sparklesGradientNav" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5170ff" />
                    <stop offset="100%" stopColor="#ff66c4" />
                  </linearGradient>
                </defs>
                <path
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
                  fill="url(#sparklesGradientNav)"/>
              </svg>
              <span className="text-purple-500 font-medium">¿QUÉ BUSCAS?</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => {
                setIsLikedOpen(true)
                setIsCartOpen(false)
              }}
            >
              <span className="text-purple-500 font-medium">❤️</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsCartOpen(true)
            setIsLikedOpen(false)
          }}
          className="hover:text-black transition-colors flex items-center gap-1 relative"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {calculateTotalItems()}
            </span>
          )}
        </button>
      </nav>

      {/* Liked Items Full Screen View */}
      {isLikedOpen && (
        <div className="fixed inset-0 z-30 bg-white overflow-y-auto" style={{ top: '64px' }}>
          {/* Header - SIN BORDE Y SIN "VOLVER A LA TIENDA" */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLikedOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-2xl font-bold">Mis Prendas Favoritas ❤️</h1>
            <button
              onClick={() => setIsLikedOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Liked Items Content */}
          <div className="container mx-auto px-6 py-8">
            {likedItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h2 className="text-2xl font-semibold mb-4">No tienes prendas favoritas</h2>
                <p className="text-gray-600 mb-8">Agrega algunas prendas increíbles a tus favoritos</p>
                <Button 
                  onClick={() => setIsLikedOpen(false)}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3"
                >
                  Seguir Comprando
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {likedItems.map((item, index) => (
                  <Card key={`${item.id}-${item.size}-${index}`} className="border-0 rounded-none shadow-none flex flex-col h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="font-normal text-sm uppercase">{item.title}</h3>
                          <h3 className="font-bold text-sm mb-2">${formatPrice(item.price)}</h3>
                          {/* ELIMINADA LA LÍNEA DE TALLA SELECCIONADA */}
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleAddToCartFromLiked(item)}
                            className="flex-1 bg-black hover:bg-gray-800 text-white rounded-none py-3 font-medium uppercase tracking-wide"
                          >
                            Agregar al carrito
                          </Button>
                          <Button 
                            onClick={() => handleRemoveFromLiked(item.id, item.size)}
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
      )}

      {/* Shopping Cart Full Screen View */}
      {isCartOpen && (
        <div className="fixed inset-0 z-30 bg-white overflow-y-auto" style={{ top: '64px' }}>
          {/* Header - SIN BORDE Y SIN "VOLVER A LA TIENDA" */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-2xl font-bold">Tu Carrito de Compras</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsLikedOpen(true)
                  setIsCartOpen(false)
                }}
                className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors"
              >
                <span className="font-medium">❤️</span>
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="container mx-auto px-6 py-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-8">Agrega algunos productos increíbles a tu carrito</p>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3"
                >
                  Seguir Comprando
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-6">Productos en tu carrito ({calculateTotalItems()})</h2>
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${item.size}-${index}`} className="flex gap-6 p-6 border rounded-lg">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-32 h-32 object-cover flex-shrink-0 rounded"
                        />
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                              <p className="text-gray-600">Talla: {item.size}</p>
                              <p className="font-semibold text-lg">${formatPrice(item.price)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddToLikedFromCart(item)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2"
                                title="Mover a favoritos"
                              >
                                ❤️
                              </button>
                              <button
                                onClick={() => handleRemoveFromCart(item.id, item.size)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">Cantidad:</span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 rounded"
                                >
                                  -
                                </button>
                                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Subtotal</p>
                              <p className="font-semibold text-lg">${formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
                    <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${formatPrice(calculateTotal())}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 font-semibold text-lg"
                    >
                      Seguir Comprando
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isCartOpen && !isLikedOpen && (
        <main className="container mx-auto px-6 pt-12 pb-auto">
          {/* Title */}
          <h1 className="wide-title text-left mb-12">
            ARMA TU OUTFIT
          </h1>

          {/* Input Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex gap-4 items-end border-4 border-gradient rounded-lg focus:border-purple-400">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Quiero un look para los días más calurosos de primavera..."
                className="flex-1 min-h-0 p-4 border-none focus:border-none transition-colors resize-none text-indigo-700 md:text-md"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className="bg-transparent border-0 shadow-none p-0 my-auto mx-4 hover:bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-500 [&_svg]:!w-8 [&_svg]:!h-8 opacity-80 hover:opacity-100"
              >
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="sparklesGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#5170ff" />
                      <stop offset="100%" stopColor="#ff66c4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
                    fill="url(#sparklesGradient)"
                  />
                </svg>
              </Button>
            </div>

            {/* Gender Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              {["Mujer", "Hombre", "Unisex", "Niño"].map((gender) => (
                <Button
                  key={gender}
                  onClick={() => handleGenderSelect(gender)}
                  className={`rounded-lg px-6 py-2 font-medium border-4 border-gradient transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${
                    selectedGender === gender
                      ? 'bg-black text-white border-black shadow-lg scale-105'
                      : 'bg-gray-50 text-black border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>

          {/* Single Status Text */}
          <div className="mb-8">
            <p className="text-xl text-black text-left">
              {isLoading 
                ? 'Estoy buscando tu outfit perfecto...'
                : selectedItems.length > 0 
                  ? 'Encontré esto para ti, ¿qué te parece?'
                  : '¡Hola! Dime, ¿qué estás buscando?'
              }
            </p>
          </div>

        {/* Content Section */}
        {selectedItems.length > 0 ? (
          /* Selected Items Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {selectedItems.map((item) => {
                const selectedSize = selectedSizes[item.id]
                const isLiked = selectedSize ? isItemLiked(item.id, selectedSize) : false
                const isRecentlyLiked = recentlyLiked[item.id]

                return (
                  <Card key={item.id} className="border-0 rounded-none shadow-none flex flex-col h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <img
                        src={item.src}
                        alt={item.comment}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="font-normal text-sm uppercase">{item.title}</h3>
                          <h3 className="font-bold text-sm mb-2">${formatPrice(item.price)}</h3>
                          <p className="text-gray-600 text-sm h-12 overflow-hidden">{item.comment}</p>
                        </div>
                        
                        {/* Size Selector */}
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2 uppercase">Talla</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.sizes.map((size: string) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(item.id, size)}
                                className={`px-3 py-1 border text-sm font-medium transition-colors ${
                                  selectedSizes[item.id] === size
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Add to Cart and Like Buttons */}
                        {selectedSizes[item.id] && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 bg-black hover:bg-gray-800 text-white rounded-none py-3 font-medium uppercase tracking-wide"
                            >
                              Agregar al carrito
                            </Button>
                            <Button 
                              onClick={() => handleAddToLiked(item)}
                              className={`rounded-none py-3 font-medium transition-all duration-300 ${
                                isLiked || isRecentlyLiked
                                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                  : 'bg-white text-red-500 border-red-500 hover:bg-red-50'
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
        ) : (
          /* Outfit Carousel */
          <div className="w-full">
            <div className="outfit-carousel">
              <div className="outfit-carousel-track" ref={scrollRef}>
                {infiniteImages.map((image, index) => (
                  <div key={`${image.id}-${index}`} className="outfit-image">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </main>
      )}

      {/* Estilos para el carrusel */}
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
