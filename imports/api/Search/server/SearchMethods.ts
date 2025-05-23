import {check} from 'meteor/check'
import {Meteor} from 'meteor/meteor'
import {Booking} from '../../../../types/Booking'
import {Customer} from '../../../../types/Customer'
import {Order} from '../../../../types/Order'
import {Bookings} from '../../Bookings/Bookings'
import {Customers} from '../../Customers/Customers'
import {Orders} from '../../Orders/Orders'

export type SearchHit<T> = T & {
  score: number
  highlights: {path: string; texts: {type: string; value: unknown}[]}[]
}

export type SearchResult = {
  bookings: SearchHit<Booking>[]
  orders: SearchHit<Order>[]
  customers: SearchHit<Customer>[]
}

Meteor.methods({
  'search.query': async (restaurantId: string, query: string) => {
    check(restaurantId, String)
    check(query, String)

    const bookings = await Bookings.rawCollection()
      .aggregate([
        {
          $search: {
            index: 'booking-search',
            text: {
              query,
              path: {
                wildcard: '*',
              },
            },
            highlight: {path: {wildcard: '*'}},
          },
        },
        {
          $match: {
            restaurantId,
          },
        },
        {
          $addFields: {
            score: {$meta: 'searchScore'},
            highlights: {$meta: 'searchHighlights'},
          },
        },
        {$sort: {score: -1}},
      ])
      .toArray()

    const orders = await Orders.rawCollection()
      .aggregate([
        {
          $search: {
            index: 'order-search',
            text: {
              query,
              path: {
                wildcard: '*',
              },
            },
            highlight: {path: {wildcard: '*'}},
          },
        },
        {
          $match: {
            restaurantId,
          },
        },
        {
          $addFields: {
            score: {$meta: 'searchScore'},
            highlights: {$meta: 'searchHighlights'},
          },
        },
        {$sort: {score: -1}},
      ])
      .toArray()

    const customers = await Customers.rawCollection()
      .aggregate([
        {
          $search: {
            index: 'customer-search',
            text: {
              query,
              path: {
                wildcard: '*',
              },
            },
            highlight: {path: {wildcard: '*'}},
          },
        },
        {
          $match: {
            restaurantId,
          },
        },
        {
          $addFields: {
            score: {$meta: 'searchScore'},
            highlights: {$meta: 'searchHighlights'},
          },
        },
        {$sort: {score: -1}},
      ])
      .toArray()

    return {bookings, orders, customers}
  },
})
