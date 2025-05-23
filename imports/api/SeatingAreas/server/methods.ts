import {check} from 'meteor/check'
import {Meteor} from 'meteor/meteor'
import {SeatingArea} from '../../../../types/SeatingArea'
import {rateLimit} from '../../../modules/rateLimit'
import {authenticateRestaurantAccess} from '../../../modules/user/authenticateRestaurantAccess'
import {Bookings} from '../../Bookings/Bookings'
import {SeatingAreas} from '../SeatingAreas'

Meteor.methods({
  /* Add a new seating area */
  'seatingAreas.insert': (restaurantId: string, doc: SeatingArea) => {
    check(restaurantId, String)
    check(doc, Object)

    // Authenticate user access to restaurant
    const user = Meteor.user()
    authenticateRestaurantAccess(user, restaurantId, ['tables', 'apps'])

    try {
      const seatingArea: SeatingArea = doc
      seatingArea.restaurantId = restaurantId
      seatingArea.createdBy = Meteor.userId()
      seatingArea.createdAt = new Date()

      return SeatingAreas.insertAsync(seatingArea)
    } catch (error) {
      // console.log('error', error);
      throw new Meteor.Error(
        'seatingAreas.insert: exception',
        error instanceof Error ? error.message : 'unknown',
        `restaurantId: ${restaurantId} userId: ${Meteor.userId()}`,
      )
    }
  },

  /* Updates a seating area */
  'seatingAreas.update': async (
    restaurantId: string,
    seatingAreaId: string,
    doc: SeatingArea,
  ) => {
    check(restaurantId, String)
    check(seatingAreaId, String)
    check(doc, Object)

    // Authenticate user access to restaurant
    const user = Meteor.user()
    authenticateRestaurantAccess(user, restaurantId, ['tables', 'apps'])

    try {
      const seatingArea = doc
      seatingArea.updatedBy = Meteor.userId()
      seatingArea.updatedAt = new Date()

      const update = await SeatingAreas.updateAsync(
        {_id: seatingAreaId, restaurantId},
        {
          $set: seatingArea,
        },
      )

      // Update area name on future bookings if it changed
      await Bookings.rawCollection().updateMany(
        {
          restaurantId,
          dateTime: {$gt: new Date()},
          tables: {$exists: true},
        },
        {
          $set: {
            'tables.$[table].area.name': seatingArea.name,
            'tables.$[table].area.internalNote': seatingArea.internalNote,
          },
        },
        {
          arrayFilters: [
            {
              'table.area._id': seatingAreaId,
              $or: [
                {'table.area.name': {$ne: seatingArea.name}},
                {
                  'table.area.internalNote': {
                    $ne: seatingArea.internalNote,
                  },
                },
              ],
            },
          ],
        },
      )

      return update
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error(
        'seatingAreas.update: exception',
        error instanceof Error ? error.message : 'unknown',
        `restaurantId: ${restaurantId} seatingAreaId: ${seatingAreaId} userId: ${Meteor.userId()}`,
      )
    }
  },
})

rateLimit({
  methods: ['seatingAreas.insert'],
  limit: 5,
  timeRange: 1000,
})
