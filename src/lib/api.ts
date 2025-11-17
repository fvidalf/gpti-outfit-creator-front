import type {
  CatalogItem,
  GenerateOutfitRequest,
  ItemDetail,
  OutfitResponse,
} from "@/types/domain"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown error" }))
      const error = new Error(errorData.detail || `HTTP ${response.status}`) as Error & { status?: number }
      error.status = response.status
      throw error
    }

    return response.json()
  }

  async generateOutfit(payload: GenerateOutfitRequest): Promise<OutfitResponse> {
    return this.makeRequest<OutfitResponse>("/ai/generate-outfit", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async fetchCatalog(): Promise<CatalogItem[]> {
    return this.makeRequest<CatalogItem[]>("/items")
  }

  async fetchItemsByIds(itemIds: string[]): Promise<ItemDetail[]> {
    if (!itemIds.length) return []
    return this.makeRequest<ItemDetail[]>("/items", {
      method: "POST",
      body: JSON.stringify({ item_ids: itemIds }),
    })
  }
}

export const apiService = new ApiService()
