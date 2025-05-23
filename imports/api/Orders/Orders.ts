import {Mongo} from 'meteor/mongo'
import {Order} from '../../../types/Order'

export const Orders = new Mongo.Collection<Order>('orders')
