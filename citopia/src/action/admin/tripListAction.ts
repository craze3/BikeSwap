import { action } from "../../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../../entity/TripEntity"

/**
 * Returns all trips.
 */
export const tripListAction = action(async () => {
  return getRepository(TripEntity).find({
    order: {
      startTime: "desc",
    },
  })
})
