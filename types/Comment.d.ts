import {Model} from './Model'

export type Comment = Model & {
  _id: string
  eventType: string
  role: string
  sender: string
  userName: string
  comment: string
  sendNotification: true
  readByRestaurant: Date
}
