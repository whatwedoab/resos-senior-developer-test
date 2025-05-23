import {Mongo} from 'meteor/mongo'
import {Restaurant} from '../../../types/Restaurant'

export const Restaurants = new Mongo.Collection<Restaurant>('restaurants')
