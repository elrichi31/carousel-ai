"use client"

import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "carousel-ai:autosave"
const DEBOUNCE_MS = 1500

export function useAutosave<T>(data: T) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setLastSaved(new Date())
      } catch {
        // localStorage might be full or unavailable
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer.current)
  }, [data])

  return { lastSaved }
}

export function loadAutosave<T>(): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function clearAutosave() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
