import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Menu } from "lucide-react"

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

function App() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
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
    },
    {
      id: 2,
      src: bottomImg,
      comment: 'Los shorts que buscabas. Estos quedan perfectos con el conjunto',
      title: 'Shorts beige de algodón',
      price: 7990,
    },
    {
      id: 3,
      src: socksImg,
      comment: 'Calcetas que se lucen muy bien con pantalones cortos',
      title: 'Calcetas blancas deportivas',
      price: 3990,
    }
  ]

  // Function to format price with thousands separators (dots)
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-8">
          <Menu className="w-6 h-6" />
          <div className="flex gap-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-black transition-colors">MUJER</a>
            <a href="#" className="hover:text-black transition-colors">HOMBRE</a>
            <a href="#" className="hover:text-black transition-colors">NIÑOS</a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-500 font-medium">¿QUÉ BUSCAS?</span>
          <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-12 pb-auto">
        {/* Title */}
        <h1 className="wide-title text-left mb-12">
          DESCRIBE TU OUTFIT
        </h1>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 items-end border-4 border-gradient rounded-lg  focus:border-purple-400">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
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
              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sparklesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
        </div>

        {/* Single Status Text - shows different messages based on state */}
        <div className="mb-8">
          <p className="text-xl text-black mb-8 text-left">
            {isLoading 
              ? 'Estoy buscando tu outfit perfecto...'
              : selectedItems.length > 0 
                ? 'Encontré esto para ti'
                : '¡Hola! Dime, ¿qué estás buscando?'
            }
          </p>
        </div>

        {/* Content Section */}
        {selectedItems.length > 0 ? (
          /* Selected Items Grid */
            <div className="grid grid-cols-4">
              {selectedItems.map((item) => (
                <Card key={item.id} className="border-0 rounded-none shadow-none">
                  <CardContent className="p-0">
                    <img
                      src={item.src}
                      alt={item.description}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-normal text-sm uppercase">{item.title}</h3>
                      <h3 className="font-bold text-sm mb-2">${formatPrice(item.price)}</h3>
                      <p className="text-gray-600 ">{item.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
    </div>
  )
}

export default App
