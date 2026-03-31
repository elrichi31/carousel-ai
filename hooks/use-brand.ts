"use client"

import { useState, useEffect, useCallback } from "react"
import type { BrandSettings } from "@/lib/types"

const STORAGE_KEY = "carousel-ai-brand"

const defaultBrand: BrandSettings = {
  name: "",
  logoUrl: null,
  colors: [],
}

export function useBrand() {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setBrand(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  // Save to localStorage on change (skip initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brand))
    }
  }, [brand, loaded])

  const updateBrand = useCallback((updates: Partial<BrandSettings>) => {
    setBrand((prev) => ({ ...prev, ...updates }))
  }, [])

  const clearBrand = useCallback(() => {
    setBrand(defaultBrand)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { brand, updateBrand, clearBrand, loaded }
}
