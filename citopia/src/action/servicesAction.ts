import { action } from "../framework"

/**
 * Provides list of available services.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#services
 */
export const servicesAction = action(() => {
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5002
  return [
    {
      id: "taxi",
      icon: `${serverUrl}:${serverPort}/assets/images/taxi.png`,
      name: "Taxi",
      description: "Cheapest taxi in Citopia!",
      paid: true,
      type: "type-c",
      vehicleType: "taxi",
    },
    {
      id: "scooter",
      icon: `${serverUrl}:${serverPort}/assets/images/scooter.png`,
      name: "Scooter",
      description: "Rent a scooter and rule the world!",
      paid: true,
      type: "type-b",
      vehicleType: "bike",
    },
  ]
})
