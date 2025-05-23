import {Model} from './Model'

export type SeatingArea = Model & {
  name: string
  bookable: boolean
  bookableOnline: boolean
  bookingPriority: number
  note: string
  internalNote: string
  restaurantId: string

}
