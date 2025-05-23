import {Customer} from './Customer'
import {Guest} from './Guest'
import {Model} from './Model'
import {Payment} from './Payment'
import {Product} from './Product'

export type Order = Model & {
  restaurantId: string
  visitorId: string
  status: string
  deliveryFee: number
  deliveryMethod: string
  date: string
  time: string
  deliveryAt: Date
  amount: number,
  vatAmount: number
  currency: string
  vatPercentage: number
  guest: Guest
  customer: Customer
  products: Product[]
  payment: Payment
  paymentMethod: string
  languageCode: string
  placedAt: Date
  receivedAt: Date
}