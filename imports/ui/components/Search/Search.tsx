import {Input, makeStyles, Tab, Tabs, Typography} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Meteor} from 'meteor/meteor'
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import React, {useEffect, useState} from 'react'
import {Restaurants} from '../../../api/Restaurants/Restaurants'
import {SearchResult} from '../../../api/Search/server/SearchMethods'
import {BookingCard} from '../BookingCard/BookingCard'
import {CustomerCard} from '../CustomerCard/CustomerCard'
import {OrderCard} from '../OrderCard/OrderCard'
import {SearchHitMeta} from '../SearchHitMeta/SearchHitMeta'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
  },
  cardHeader: {
    fontWeight: 'bold',
  },
  chipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  tabCount: {
    color: theme.palette.text.secondary,
  },
}))

export function Search() {
  const classes = useStyles()
  const isLoading = useSubscribe('restaurants')
  const restaurants = useTracker(() => Restaurants.find({}).fetch())
  const [searchString, setSearchString] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')

  const [results, setResults] = useState<SearchResult | null>(null)
  const [tab, setTab] = useState<string>('bookings')

  const handleSearch = () => {
    Meteor.call(
      'search.query',
      selectedRestaurant,
      searchString,
      (err: Meteor.Error | null, res: SearchResult) => {
        if (err) {
          console.error('Search error:', err)
          return
        }
        console.group('Search results')
        console.debug('Bookings:', res.bookings)
        console.debug('Orders:', res.orders)
        console.debug('Customers:', res.customers)
        console.groupEnd()
        setResults(res)
      },
    )
  }

  useEffect(() => {
    console.debug('Selected restaurant', selectedRestaurant)
  }, [selectedRestaurant])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
    >
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="restaurant-label">Restaurant</InputLabel>
            <Select
              disabled={isLoading()}
              labelId="restaurant-label"
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(String(e.target.value))}
            >
              {restaurants.map((restaurant) => (
                <MenuItem value={restaurant._id} key={restaurant._id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Input
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            disabled={!selectedRestaurant || !searchString}
            type="submit"
          >
            Search
          </Button>
        </Grid>

        {!!results && (
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                  <Tab
                    label={
                      <Typography>
                        Bookings{' '}
                        <span className={classes.tabCount}>
                          {results.bookings.length}
                        </span>
                      </Typography>
                    }
                    value="bookings"
                  />
                  <Tab
                    label={
                      <Typography>
                        Orders{' '}
                        <span className={classes.tabCount}>
                          {results.orders.length}
                        </span>
                      </Typography>
                    }
                    value="orders"
                  />
                  <Tab
                    label={
                      <Typography>
                        Customers{' '}
                        <span className={classes.tabCount}>
                          {results.customers.length}
                        </span>
                      </Typography>
                    }
                    value="customers"
                  />
                </Tabs>
              </Grid>
              <Grid container spacing={2}>
                {tab === 'bookings' &&
                  results.bookings.map((booking) => (
                    <Grid item xs={6} key={booking._id}>
                      <BookingCard booking={booking}>
                        <SearchHitMeta hit={booking} />
                      </BookingCard>
                    </Grid>
                  ))}

                {tab === 'orders' &&
                  results.orders.map((order) => (
                    <Grid item xs={6} key={order._id}>
                      <OrderCard order={order}>
                        <SearchHitMeta hit={order} />
                      </OrderCard>
                    </Grid>
                  ))}

                {tab === 'customers' &&
                  results.customers.map((customer) => (
                    <Grid item xs={4} key={customer._id}>
                      <CustomerCard customer={customer}>
                        <SearchHitMeta hit={customer} />
                      </CustomerCard>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </form>
  )
}
