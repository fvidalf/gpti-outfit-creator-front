import type {
  CatalogItem,
  GenerateOutfitRequest,
  ItemDetail,
  OutfitResponse,
} from "@/types/domain"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
const SESSION_STORAGE_KEY = "oc-session-id"

const ensureSessionId = (): string => {
  const fallbackId = () => `session_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`

  if (typeof window === "undefined") return fallbackId()

  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing

    const newId = fallbackId()
    localStorage.setItem(SESSION_STORAGE_KEY, newId)
    return newId
  } catch {
    return fallbackId()
  }
}

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
    const sessionId = payload.sessionId ?? ensureSessionId()
    return this.makeRequest<OutfitResponse>("/ai/generate-outfit", {
      method: "POST",
      body: JSON.stringify({ ...payload, sessionId }),
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
