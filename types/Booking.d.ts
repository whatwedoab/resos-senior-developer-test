import {Comment} from './Comment'
import {Guest} from './Guest'
import {Model} from './Model'
import {RestaurantNote} from './RestaurantNote'
import {Table} from './Table'

export type Booking = Model & {
  restaurantId: string
  date: string
  time: string
  dateTime: Date
  endDateTime: Date
  people: number
  duration: number
  status: string
  guest?: Guest
  tables?: Table[]
  source: string
  languageCode: string
  openingHourId: string
  comments: Comment[]
  restaurantNotes: RestaurantNote[]
  activityAt: Date
}