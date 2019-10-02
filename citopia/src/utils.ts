import * as turf from "@turf/turf"
import { Units } from "@turf/turf"

/**
 * Checks if given point is in the radius of another point.
 */
export function isCurrentPointAroundGivenPoint(options: {
  currentLat: number | string
  currentLng: number | string
  lat: number | string
  lng: number | string
  radius: number
  units: Units
}) {
  const lat =
    typeof options.lat === "string" ? parseFloat(options.lat) : options.lat
  const lng =
    typeof options.lng === "string" ? parseFloat(options.lng) : options.lng
  const currentLat =
    typeof options.currentLat === "string"
      ? parseFloat(options.currentLat)
      : options.currentLat
  const currentLng =
    typeof options.currentLng === "string"
      ? parseFloat(options.currentLng)
      : options.currentLng

  const currentPoint = turf.point([currentLng, currentLat])
  const point = turf.point([lng, lat])
  const pointBuffer = turf.buffer(point, options.radius, {
    units: options.units,
  })
  return turf.inside(currentPoint, pointBuffer)
}
