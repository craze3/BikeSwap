import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"

/**
 * Registers a new trip.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#register
 */
export const registerAction = action(async ({ query }) => {
  const serviceId = query("serviceId", true)
  const userId = query("userId", true)
  const currentLat = query("currentLat", true)
  const currentLng = query("currentLng", true)
  const mapBitId = query("mapBitId", true)

  await getRepository(TripEntity).save({
    userId,
    serviceId,
    vehicleId: mapBitId,
    status: "initiated",
    currentLat,
    currentLng,
    completed: false,
    startTime: Math.floor(new Date().getTime() / 1000),
  })

  return {
    status: "success",
  }
})
