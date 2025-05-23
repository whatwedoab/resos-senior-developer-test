import {Mongo} from 'meteor/mongo'
import {Customer} from '../../../types/Customer'

export const Customers = new Mongo.Collection<Customer>('customers')
