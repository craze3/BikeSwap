import { action } from "../../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../../entity/TripEntity"
import { VehicleEntity } from "../../entity/VehicleEntity"

/**
 * Updates a given trip.
 */
export const tripSaveAction = action(async ({ body }) => {
  const tripBody: {
    id: string
    status: string
    vehicleId: string
    completed: boolean
    readyForPay: boolean
  } = body

  const trip = await getRepository(TripEntity).findOneOrFail(tripBody.id)
  const vehicle = tripBody.vehicleId
    ? await getRepository(VehicleEntity).findOneOrFail(tripBody.vehicleId)
    : undefined

  if (trip.serviceId === "taxi") {
    if (vehicle) {
      trip.status = tripBody.status
      trip.vehicleId = tripBody.vehicleId
      trip.completed = tripBody.completed
      trip.readyForPay = tripBody.readyForPay
      trip.finishTime = Math.floor(new Date().getTime() / 1000)
      vehicle.currentTripId = trip.id

      await getRepository(TripEntity).save(trip)
      await getRepository(VehicleEntity).save(vehicle)
    }
  }

  return {
    status: "success",
  }
})
