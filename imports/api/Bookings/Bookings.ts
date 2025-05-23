import {Mongo} from 'meteor/mongo'
import {Booking} from '../../../types/Booking'

export const Bookings = new Mongo.Collection<Booking>('bookings')
