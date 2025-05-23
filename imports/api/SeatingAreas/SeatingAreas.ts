import {Mongo} from 'meteor/mongo'
import {SeatingArea} from '../../../types/SeatingArea'

export const SeatingAreas = new Mongo.Collection<SeatingArea>('seatingAreas')
