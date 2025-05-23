import rateLimit from '../../../../modules/rateLimit';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { authenticateRestaurantAccess } from '../../../../modules/user';
import SeatingAreas from '../SeatingAreas';
import Bookings from '../../Bookings/Bookings';

Meteor.methods({
  /* Add a new seating area */
  'seatingAreas.insert': function seatingAreasInsert(restaurantId, doc) {
    check(restaurantId, String);
    check(doc, Object);

    // Authenticate user access to restaurant
    const user = Meteor.user();
    authenticateRestaurantAccess(user, restaurantId, ['tables', 'apps']);

    try {
      const seatingArea = doc;
      seatingArea.restaurantId = restaurantId;
      seatingArea.createdBy = Meteor.userId();
      seatingArea.createdAt = new Date();

      return SeatingAreas.insert(seatingArea);
    } catch (error) {
      // console.log('error', error);
      throw new Meteor.Error(
        'seatingAreas.insert: exception',
        error.message,
        `restaurantId: ${restaurantId} userId: ${Meteor.userId()}`
      );
    }
  },

  /* Updates a seating area */
  'seatingAreas.update': function seatingAreasUpdate(
    restaurantId,
    seatingAreaId,
    doc
  ) {
    check(restaurantId, String);
    check(seatingAreaId, String);
    check(doc, Object);

    // Authenticate user access to restaurant
    const user = Meteor.user();
    authenticateRestaurantAccess(user, restaurantId, ['tables', 'apps']);

    try {
      const seatingArea = doc;
      seatingArea.updatedBy = Meteor.userId();
      seatingArea.updatedAt = new Date();

      const update = SeatingAreas.update(
        { _id: seatingAreaId, restaurantId },
        {
          $set: seatingArea,
        }
      );

      // Update area name on future bookings if it changed
      Meteor.wrapAsync(
        Bookings.rawCollection().update(
          {
            restaurantId,
            dateTime: { $gt: new Date() },
            tables: { $exists: true },
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
                  { 'table.area.name': { $ne: seatingArea.name } },
                  {
                    'table.area.internalNote': {
                      $ne: seatingArea.internalNote,
                    },
                  },
                ],
              },
            ],
            multi: true,
          }
        )
      );

      return update;
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(
        'seatingAreas.update: exception',
        error.message,
        `restaurantId: ${restaurantId} seatingAreaId: ${seatingAreaId} userId: ${Meteor.userId()}`
      );
    }
  },
});

rateLimit({
  methods: [
    'seatingAreas.insert',
  ],
  limit: 5,
  timeRange: 1000,
});