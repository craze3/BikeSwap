import { action } from "../framework"

/**
 * Returns all bits that app shows on the map.
 *
 * Bit is a marker on the map.
 * It can be anything - car, bike, shop, parking lot, etc.
 * It can also represent different states of the same item.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#bits
 */
export const bitsAction = action(() => {
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5002
  return [
    {
      id: "taxi",
      icon: `${serverUrl}:${serverPort}/assets/images/taxi-bit.png`,
      name: "Car",
      color: "#fffb25",
      description: "Call taxi",
    },
    {
      id: "scooter",
      icon: `${serverUrl}:${serverPort}/assets/images/scooter-bit.png`,
      name: "Scooter",
      color: "#65ffdd",
      description: "Rent scooter",
    },
  ]
})
