import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Stores information about trips.
 */
@Entity("trip")
export class TripEntity {
  /**
   * Trip id. Simply used to identify trips.
   */
  @PrimaryGeneratedColumn("uuid")
  id?: string

  /**
   * Id of a user who is trip initiator and owner.
   */
  @Column()
  userId?: string

  /**
   * Service used in this trip.
   */
  @Column()
  serviceId?: string

  /**
   * Vehicle used in this trip.
   */
  @Column()
  vehicleId?: string

  /**
   * Current user position in the trip (latitude).
   */
  @Column()
  currentLat?: string

  /**
   * Current user position in the trip (longitude).
   */
  @Column()
  currentLng?: string

  /**
   * Time, when trip was started.
   */
  @Column()
  startTime?: number

  /**
   * Time, when trip was finished.
   */
  @Column({ nullable: true })
  finishTime?: number

  /**
   * Indicates if trip has been completed or not.
   */
  @Column({ default: false })
  completed?: boolean

  /**
   * Indicates if trip is ready for payment.
   */
  @Column({ default: false })
  readyForPay?: boolean

  /**
   * Trip status.
   */
  @Column()
  status?: string
}
