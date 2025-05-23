import {Model} from './Model'
import {SeatingArea} from './SeatingArea'

export type Table = Model & {
  name: string
  seatsMin: number
  seatsMax: number
  internalNote: string
  area: Pick<SeatingArea, '_id' | 'name' | 'internalNote'>
}
