import { action } from "../../framework"
import { getRepository } from "typeorm"
import { VehicleEntity } from "../../entity/VehicleEntity"

/**
 * Saves a given vehicle.
 */
export const vehicleSaveAction = action(async ({ body }) => {
  const vehicleBody: {
    lat: number
    lng: number
    name: string
    type: "scooter" | "taxi"
  } = body

  // save in the database
  await getRepository(VehicleEntity).save(vehicleBody)

  return {
    status: "success",
  }
})
