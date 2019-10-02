import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Physically located vehicle (scooter or a taxi).
 */
@Entity("vehicle")
export class VehicleEntity {
  /**
   * Vehicle id. Simply used to identify vehicles.
   */
  @PrimaryGeneratedColumn("uuid")
  id?: string

  /**
   * Vehicle type.
   */
  @Column({ type: String })
  type?: "scooter" | "taxi"

  /**
   * Vehicle name.
   */
  @Column()
  name?: string

  /**
   * Vehicle position on the map (latitude).
   */
  @Column()
  lat?: number

  /**
   * Vehicle position on the map (longitude).
   */
  @Column()
  lng?: number

  @Column({ default: "", type: String })
  currentTripId?: string

  @Column({ default: "", type: String })
  currentUserId?: string

  @Column({ nullable: true })
  status?: string
}
