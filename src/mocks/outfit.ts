import outfit1 from "@/assets/samples/outfit1.png"
import outfit2 from "@/assets/samples/outfit2.png"
import outfit3 from "@/assets/samples/outfit3.png"
import outfit4 from "@/assets/samples/outfit4.png"
import outfit5 from "@/assets/samples/outfit5.png"
import outfit6 from "@/assets/samples/outfit6.png"
import bottomImg from "@/assets/outfit/bottom.png"
import socksImg from "@/assets/outfit/socks.png"
import topImg from "@/assets/outfit/top.png"
import type { CatalogItem, OutfitResponse } from "@/types/domain"

export const mockOutfitResponse: OutfitResponse = {
  sessionId: "session_mock_1",
  conversationalResponse: "Esto es lo que encontré para ti. Dime qué te parece.",
  outfitSuggestions: [
    {
      itemId: "item_id_1",
      itemName: "Polera con motivo estampado Loose Fit",
      comment: "Un top suelto y cómodo perfecto para el calor",
    },
    {
      itemId: "item_id_2",
      itemName: "Shorts beige de algodón",
      comment: "Los shorts que buscabas. Estos quedan perfectos con el conjunto",
    },
    {
      itemId: "item_id_3",
      itemName: "Calcetas blancas deportivas",
      comment: "Calcetas que se lucen muy bien con pantalones cortos",
    },
  ],
}

export const mockCatalog: CatalogItem[] = [
  {
    item_id: "item_id_1",
    name: "Polera con motivo estampado Loose Fit",
    gender: ["female"],
    category: "top",
    price: 8990,
    sizes: ["XS", "S", "M", "L", "XL"],
    photo_url: topImg,
    tags: ["summer", "casual", "algodón"],
  },
  {
    item_id: "item_id_2",
    name: "Shorts beige de algodón",
    gender: ["male", "female"],
    category: "bottom",
    price: 7990,
    sizes: ["28", "30", "32", "34", "36", "38"],
    photo_url: bottomImg,
    tags: ["casual", "beige"],
  },
  {
    item_id: "item_id_3",
    name: "Calcetas blancas deportivas",
    gender: ["any"],
    category: "accessory",
    price: 3990,
    sizes: ["35-37", "38-40", "41-43", "44-46"],
    photo_url: socksImg,
    tags: ["sport", "socks"],
  },
]

export const mockOutfitCarousel = [
  { id: 1, src: outfit1, alt: "Outfit 1" },
  { id: 2, src: outfit2, alt: "Outfit 2" },
  { id: 3, src: outfit3, alt: "Outfit 3" },
  { id: 4, src: outfit4, alt: "Outfit 4" },
  { id: 5, src: outfit5, alt: "Outfit 5" },
  { id: 6, src: outfit6, alt: "Outfit 6" },
]
