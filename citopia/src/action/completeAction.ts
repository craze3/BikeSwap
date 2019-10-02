import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"
import { VehicleEntity } from "../entity/VehicleEntity"

/**
 * Finishes current trip.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#complete
 */
export const completeAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const serviceId = query("serviceId", true)

  // load trip for current user that we need to complete
  const trip = await getRepository(TripEntity).findOneOrFail({
    userId,
    serviceId,
    completed: false,
  })

  // mark as completed and save the trip
  trip.completed = true
  await getRepository(TripEntity).save(trip)

  // unbound user from vehicle (make vehicle free for other customers)
  if (trip.vehicleId) {
    const vehicle = await getRepository(VehicleEntity).findOneOrFail(
      trip.vehicleId,
    )
    vehicle.currentTripId = ""
    await getRepository(VehicleEntity).save(vehicle)
  }

  return {
    status: "success",
  }
})
