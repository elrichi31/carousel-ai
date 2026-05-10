"use client"

import { useCallback, useState } from "react"
import type { Slide, PostCaption, CarouselFormData } from "@/lib/types"

export interface HistoryEntry {
  id: string
  timestamp: number
  topic: string
  slides: Slide[]
  caption: PostCaption | null
  formData: CarouselFormData
}

const STORAGE_KEY = "carousel-session-history"
const MAX_ENTRIES = 8

function loadFromStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

function persist(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch { /* quota exceeded — ignore */ }
}

export function useSessionHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadFromStorage())

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const next: HistoryEntry = { ...entry, id: Date.now().toString(), timestamp: Date.now() }
    setEntries((prev) => {
      const updated = [next, ...prev].slice(0, MAX_ENTRIES)
      persist(updated)
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  return { entries, addEntry, clearHistory }
}
