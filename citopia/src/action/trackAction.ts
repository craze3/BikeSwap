import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"

/**
 * Stores current user location when track event is emitted.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#track
 */
export const trackAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const currentLat = query("currentLat", true)
  const currentLng = query("currentLng", true)

  // load all active trips
  const trips = await getRepository(TripEntity).find({
    userId,
    completed: false,
  })

  // update current position on all those trips
  for (let trip of trips) {
    trip.currentLat = currentLat
    trip.currentLng = currentLng
  }

  // save in the database
  await getRepository(TripEntity).save(trips)

  return {
    status: "success",
  }
})
