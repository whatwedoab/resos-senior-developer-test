import {Address} from './Address'
import {Booking} from './Booking'
import {Model} from './Model'

export type Customer = Model & {
  restaurantId?: string
  name: string
  emails?: string[]
  phones?: string[]
  note?: string
  address?: Address
  tags?: string[]
  activityAt?: Date
  totalBookings?: number
  latestBooking?: Pick<Booking, '_id' | 'dateTime'>
}
