/**
 * Extracts dominant colors from an image using canvas pixel sampling.
 * Groups similar colors and returns the top N distinct ones as hex strings.
 */
export function extractColorsFromImage(
  imageUrl: string,
  maxColors: number = 5
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve([])
        return
      }

      // Sample at a small size for performance
      const size = 64
      canvas.width = size
      canvas.height = size
      ctx.drawImage(img, 0, 0, size, size)

      const imageData = ctx.getImageData(0, 0, size, size).data
      const colorMap = new Map<string, number>()

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]
        const a = imageData[i + 3]

        // Skip transparent/near-transparent pixels
        if (a < 128) continue

        // Skip near-white and near-black (not useful for branding)
        const brightness = (r + g + b) / 3
        if (brightness > 240 || brightness < 15) continue

        // Quantize to reduce color variations (round to nearest 16)
        const qr = Math.round(r / 16) * 16
        const qg = Math.round(g / 16) * 16
        const qb = Math.round(b / 16) * 16

        const hex = rgbToHex(qr, qg, qb)
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
      }

      // Sort by frequency and take top colors
      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxColors)
        .map(([hex]) => hex)

      resolve(sorted)
    }

    img.onerror = () => resolve([])
    img.src = imageUrl
  })
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
      .join("")
  )
}
