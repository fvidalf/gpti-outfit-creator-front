import { useEffect, useRef } from "react"

interface OutfitCarouselProps {
  images: { id: number; src: string; alt: string }[]
}

export function OutfitCarousel({ images }: OutfitCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    let scrollAmount = 0
    const scrollSpeed = 0.2
    const imageWidth = 320
    const totalImages = images.length
    const resetPoint = imageWidth * totalImages

    const step = () => {
      scrollAmount += scrollSpeed
      if (scrollAmount >= resetPoint) {
        scrollAmount = 0
      }
      scrollElement.style.transform = `translateX(-${scrollAmount}px)`
      requestAnimationFrame(step)
    }

    const animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [images.length])

  return (
    <div className="w-full">
      <div className="outfit-carousel">
        <div className="outfit-carousel-track" ref={scrollRef}>
          {[...images, ...images].map((image, index) => (
            <div key={`${image.id}-${index}`} className="outfit-image">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
