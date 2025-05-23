import {Model} from './Model'

export type RestaurantNote = Model & {
  restaurantNote: string
  createdAt: Date
  userId: string
  userName: string
}