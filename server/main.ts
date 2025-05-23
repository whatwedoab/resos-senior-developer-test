import {Link, LinksCollection} from '/imports/api/links'
import {Meteor} from 'meteor/meteor'
import {Bookings} from '../imports/api/Bookings/Bookings'
import {Customers} from '../imports/api/Customers/Customers'
import {Orders} from '../imports/api/Orders/Orders'
import {Restaurants} from '../imports/api/Restaurants/Restaurants'
import {testBookings} from '../other/seed/testBookings'
import {testCustomers} from '../other/seed/testCustomers'
import {testOrders} from '../other/seed/testOrders'
import {testRestaurants} from '../other/seed/testRestaurants'
import '../imports/api/Restaurants/server/RestaurantPublications'
import '../imports/api/Search/server/SearchMethods'

Meteor.startup(async () => {
  // // If the Links collection is empty, add some data.
  // if (await LinksCollection.find().countAsync() === 0) {
  //   await insertLink({
  //     title: 'Do the Tutorial',
  //     url: 'https://www.meteor.com/tutorials/react/creating-an-app',
  //   });
  //
  //   await insertLink({
  //     title: 'Follow the Guide',
  //     url: 'https://guide.meteor.com',
  //   });
  //
  //   await insertLink({
  //     title: 'Read the Docs',
  //     url: 'https://docs.meteor.com',
  //   });
  //
  //   await insertLink({
  //     title: 'Discussions',
  //     url: 'https://forums.meteor.com',
  //   });
  // }
  //
  // // We publish the entire Links collection to all clients.
  // // In order to be fetched in real-time to the clients
  // Meteor.publish("links", function () {
  //   return LinksCollection.find();
  // });

  console.log('MONGO_URL', process.env.MONGO_URL)
  console.log('DB NAME:', (await Bookings.rawDatabase()).databaseName)

  console.log('Bookings', await Bookings.find().countAsync())
  console.log('Customers', await Customers.find().countAsync())
  console.log('Orders', await Orders.find().countAsync())
  console.log('Restaurants', await Restaurants.find().countAsync())

  // await Bookings.removeAsync({})

  if (!(await Bookings.find().countAsync())) {
    await Bookings.rawCollection().insertMany(testBookings)
    console.log('Seeded bookings')
  }

  if (!(await Customers.find().countAsync())) {
    await Customers.rawCollection().insertMany(testCustomers)
    console.log('Seeded customers')
  }

  if (!(await Orders.find().countAsync())) {
    await Orders.rawCollection().insertMany(testOrders)
    console.log('Seeded orders')
  }

  if (!(await Restaurants.find().countAsync())) {
    await Restaurants.rawCollection().insertMany(testRestaurants)
    console.log('Seeded restaurants')
  }
})
