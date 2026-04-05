/**
 * Extracts dominant colors from an image using canvas pixel sampling.
 * Merges similar colors (e.g. multiple greens) into a single averaged color
 * and returns only the principal distinct ones as hex strings.
 */
export function extractColorsFromImage(
  imageUrl: string,
  maxColors: number = 4
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

        // Quantize to reduce color variations (round to nearest 32)
        const qr = Math.round(r / 32) * 32
        const qg = Math.round(g / 32) * 32
        const qb = Math.round(b / 32) * 32

        const hex = rgbToHex(qr, qg, qb)
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
      }

      // Sort by frequency
      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12) // take top candidates before merging

      // Merge similar colors: if two colors are close in RGB space, average them
      const merged = mergeSimilarColors(
        sorted.map(([hex, count]) => ({ hex, count })),
        60 // distance threshold — colors within this range get merged
      )

      // Return only the top principal colors
      resolve(merged.slice(0, maxColors).map((c) => c.hex))
    }

    img.onerror = () => resolve([])
    img.src = imageUrl
  })
}

/** Parse a hex color to RGB tuple */
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

/** Euclidean distance between two RGB colors */
function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

/**
 * Merges colors that are within `threshold` RGB distance.
 * Produces a weighted average (by pixel count) for each cluster.
 */
function mergeSimilarColors(
  colors: { hex: string; count: number }[],
  threshold: number
): { hex: string; count: number }[] {
  const clusters: { r: number; g: number; b: number; count: number }[] = []

  for (const { hex, count } of colors) {
    const [r, g, b] = hexToRgb(hex)
    let merged = false

    for (const cluster of clusters) {
      const avg: [number, number, number] = [
        cluster.r / cluster.count,
        cluster.g / cluster.count,
        cluster.b / cluster.count,
      ]
      if (colorDistance([r, g, b], avg) < threshold) {
        cluster.r += r * count
        cluster.g += g * count
        cluster.b += b * count
        cluster.count += count
        merged = true
        break
      }
    }

    if (!merged) {
      clusters.push({ r: r * count, g: g * count, b: b * count, count })
    }
  }

  return clusters
    .sort((a, b) => b.count - a.count)
    .map((c) => ({
      hex: rgbToHex(
        Math.round(c.r / c.count),
        Math.round(c.g / c.count),
        Math.round(c.b / c.count)
      ),
      count: c.count,
    }))
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
      .join("")
  )
}
