import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"
import { VehicleEntity } from "../entity/VehicleEntity"
import { isCurrentPointAroundGivenPoint } from "../utils"

/**
 * Provides information about services and currently active trips.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#service-info
 */
export const serviceInfoAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const currentLat = query("currentLat")
  const currentLng = query("currentLng")
  const mapLat = query("mapLat")
  const mapLng = query("mapLng")

  const trip = await getRepository(TripEntity).findOne({
    userId,
    completed: false,
  })

  // if there is no active trip, we return suggested services
  if (!trip) {
    // load all free scooters we have
    const vehicles = await getRepository(VehicleEntity).find({
      type: "scooter",
      currentUserId: "",
    })

    const aroundVehicles = vehicles.filter(vehicle => {
      return isCurrentPointAroundGivenPoint({
        currentLat: mapLat,
        currentLng: mapLng,
        lat: vehicle.lat!,
        lng: vehicle.lng!,
        radius: 1000,
        units: "meters",
      })
    })

    // filter scooters so they are near user
    // todo: we need to filter vehicles in a current user lat/lng
    // if there is no record, we need to make sure our parking is in the range of user vehicle

    // convert scooters to map bits
    const freeScootersMapBits = aroundVehicles.map(vehicle => {
      return {
        id: vehicle.id,
        bitId: "scooter",
        lat: vehicle.lat,
        lng: vehicle.lng,
      }
    })

    // return back all services we suggest
    // note, map bits will be shown only after user selects service in the list
    return [
      { serviceId: "taxi" },
      { serviceId: "scooter", mapBits: freeScootersMapBits },
    ]
  }

  // in the case, if there is an active trip...
  let mapBits: any[] = []
  if (trip.serviceId === "scooter") {
    // for scooter everything is simple - we just return in on current user position
    // since its a place where he started to use scooter
    // in real world scenario probably its better to have a gps on scooter itself
    // and return scooter position on the map instead
    mapBits.push({
      id: trip.vehicleId,
      bitId: "scooter",
      currentPosition: true,
      // latitude: vehicle.currentLat,
      // longitude: vehicle.currentLng,
    })
  } else if (trip.serviceId === "taxi") {
    // for taxi we show map bit depend on vehicle status
    // if trip was just initiated, we show all available vehicles around user
    if (trip.status === "initiated") {
      // get some vehicles that aren't busy yet
      const vehicles = await getRepository(VehicleEntity).find({
        type: "taxi",
        currentTripId: "",
      })

      const aroundVehicles = vehicles.filter(vehicle => {
        return isCurrentPointAroundGivenPoint({
          currentLat,
          currentLng,
          lat: vehicle.lat!,
          lng: vehicle.lng!,
          radius: 1000,
          units: "meters",
        })
      })

      // todo: add geo-position filtering
      mapBits = aroundVehicles.map(vehicle => ({
        id: vehicle.id,
        bitId: "taxi",
        lat: vehicle.lat,
        lng: vehicle.lng,
      }))
    } else if (trip.status === "in-progress" || trip.status === "waiting") {
      // if trip status is "in-progress" or "waiting" it means there is a car
      // already arriving / driving this trip, so we need to return that
      // particular vehicle position
      const vehicle = await getRepository(VehicleEntity).findOneOrFail(
        trip.vehicleId,
      )
      mapBits.push({
        id: vehicle.id,
        bitId: "taxi",
        lat: vehicle.lat,
        lng: vehicle.lng,
      })
    }
  }

  // generate a status message
  let statusMessage: string = ""
  if (trip.serviceId === "taxi") {
    if (trip.status === "initiated") {
      statusMessage = "Waiting for available vehicles..."
    } else if (trip.status === "waiting") {
      statusMessage = "Waiting for a vehicle to arrive..."
    } else if (trip.status === "in-progress") {
      statusMessage = "Trip is in progress"
    }

    if (trip.readyForPay) {
      statusMessage = "Trip has been finished"
    }
  } else if (trip.serviceId === "scooter") {
    statusMessage = "Trip is in progress"
  }

  // check if we need to track a user
  let track = false
  if (trip.serviceId === "taxi") {
    // for taxi we track only when trip has actually started
    if (trip.status === "in-progress") {
      track = true
    }
  } else if (trip.serviceId === "scooter") {
    // for scooter we track all the way once he started to use scooter
    track = true
  }

  // determine if user is able to press a pay button and pay for the trip
  let readyForPay = false
  if (trip.serviceId === "taxi") {
    readyForPay = trip.readyForPay === true
  } else if (trip.serviceId === "scooter") {
    readyForPay = true
  }

  // calculate trip cost. for simplification purposes we just use a trip duration
  let cost = ""
  let tokens = 0
  if (trip.finishTime) {
    tokens = (trip.finishTime - trip.startTime!) * 0.001
    cost = `$${tokens}`
  } else {
    tokens = (Math.floor(new Date().getTime() / 1000) - trip.startTime!) * 0.001
    cost = `$${tokens}`
  }

  return [
    {
      serviceId: trip.serviceId,
      mapBits,
      statusMessage,
      track,
      cost,
      tokens,
      readyForPay,
    },
  ]
})
