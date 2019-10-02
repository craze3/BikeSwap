import { action } from "../../framework"
import { getRepository } from "typeorm"
import { VehicleEntity } from "../../entity/VehicleEntity"

/**
 * Returns all vehicles.
 */
export const vehicleListAction = action(async () => {
  return getRepository(VehicleEntity).find()
})
