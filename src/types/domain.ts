export type GenderFilter = "male" | "female" | "any"

export interface OutfitSuggestion {
  itemId: string
  itemName: string
  comment: string
}

export interface OutfitResponse {
  sessionId: string
  conversationalResponse: string
  outfitSuggestions: OutfitSuggestion[]
}

export interface CatalogItem {
  item_id: string
  name: string
  gender: GenderFilter[]
  category: string
  price: number
  sizes: string[]
  photo_url: string
  tags?: string[]
}

export interface ProductCardData {
  id: string
  name: string
  price: number
  sizes: string[]
  photoUrl: string
  comment?: string
}

export interface CartLineItem {
  itemId: string
  name: string
  price: number
  size: string
  quantity: number
  photoUrl: string
}

export interface LikedItem {
  itemId: string
  name: string
  price: number
  size: string
  photoUrl: string
}
