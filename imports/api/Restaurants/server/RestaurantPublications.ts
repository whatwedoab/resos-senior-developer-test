import {Meteor} from 'meteor/meteor'
import {Restaurants} from '../Restaurants'

Meteor.publish('restaurants', function () {
  return Restaurants.find()
})
