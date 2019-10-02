import cors from "cors"
import express from "express"
import * as path from "path"
import { createConnection } from "typeorm"
import { tripListAction } from "./action/admin/tripListAction"
import { tripRemoveAction } from "./action/admin/tripRemoveAction"
import { tripSaveAction } from "./action/admin/tripSaveAction"
import { vehicleListAction } from "./action/admin/vehicleListAction"
import { vehicleRemoveAction } from "./action/admin/vehicleRemoveAction"
import { vehicleSaveAction } from "./action/admin/vehicleSaveAction"
import { bitsAction } from "./action/bitsAction"
import { completeAction } from "./action/completeAction"
import { registerAction } from "./action/registerAction"
import { serviceInfoAction } from "./action/serviceInfoAction"
import { servicesAction } from "./action/servicesAction"
import { trackAction } from "./action/trackAction"
import { TripEntity } from "./entity/TripEntity"
import { VehicleEntity } from "./entity/VehicleEntity"
import bodyParser = require("body-parser")

async function bootstrap() {
  // create express server
  const app = express()

  // setup express server
  app.use(cors())
  app.use(bodyParser.json())
  app.use(
    "/assets/images",
    express.static(path.resolve(__dirname + "/../assets/images")),
  )

  // api for citopia
  app.get("/services", servicesAction)
  app.get("/bits", bitsAction)
  app.get("/service-info", serviceInfoAction)
  app.get("/register", registerAction)
  app.get("/complete", completeAction)
  app.get("/track", trackAction)

  // admin api (for web interface)
  app.get("/vehicles", vehicleListAction)
  app.post("/vehicles", vehicleSaveAction)
  app.delete("/vehicles/:id", vehicleRemoveAction)
  app.get("/trips", tripListAction)
  app.post("/trips", tripSaveAction)
  app.delete("/trips/:id", tripRemoveAction)

  // create a database connection
  await createConnection({
    type: "sqlite",
    database: __dirname + "/database.sqlite",
    synchronize: true,
    logging: false,
    entities: [TripEntity, VehicleEntity],
  })

  // launch server
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const port = process.env.PORT || 5002
  app.listen(port, () => {
    console.log(`Server is running at ${serverUrl}:${port}`)
  })
}

bootstrap().catch(error => console.error(error))
