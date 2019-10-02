import { action } from "../../framework"
import { getRepository } from "typeorm"
import { VehicleEntity } from "../../entity/VehicleEntity"

/**
 * Removes a vehicle by id.
 */
export const vehicleRemoveAction = action(async ({ params }) => {
  const id = params("id", true)
  const vehicle = await getRepository(VehicleEntity).findOneOrFail(id)
  await getRepository(VehicleEntity).remove(vehicle)
  return {
    status: "success",
  }
})
