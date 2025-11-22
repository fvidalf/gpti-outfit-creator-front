export type GenderFilter = "male" | "female" | "any"

export interface GenerateOutfitRequest {
  prompt: string
  gender?: GenderFilter
  sessionId?: string
  lockedItems?: string[]
}

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
  sizingSchema?: string
  availability?: Record<string, number>
  availableSizes?: string[]
  unavailableSizes?: string[]
  photo_url: string
  tags?: string[]
}

export interface ItemDetail {
  item_id: string
  name: string
  price: number
  sizes: string[]
  sizingSchema?: string
  availability?: Record<string, number>
  availableSizes?: string[]
  unavailableSizes?: string[]
  photo_url: string
  gender?: GenderFilter[]
  category?: string
  tags?: string[]
}

export interface ProductCardData {
  id: string
  name: string
  price: number
  sizes: string[]
  photoUrl: string
  comment?: string
  availableSizes: string[]
  unavailableSizes: string[]
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
