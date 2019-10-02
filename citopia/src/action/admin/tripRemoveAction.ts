import { action } from "../../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../../entity/TripEntity"

/**
 * Removes a trip by trip id.
 */
export const tripRemoveAction = action(async ({ params }) => {
  const id = params("id", true)
  const trip = await getRepository(TripEntity).findOneOrFail(id)
  await getRepository(TripEntity).remove(trip)
  return {
    status: "success",
  }
})
