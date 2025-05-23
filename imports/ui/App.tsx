import {Container, makeStyles, Typography} from '@material-ui/core'
import React from 'react'
import {Search} from './components/Search/Search'

const useStyles = makeStyles((theme) => ({
  h1: {
    padding: `${theme.spacing(2)}px 0`,
  },
}))

export const App = () => {
  const classes = useStyles()
  return (
    <Container maxWidth="md">
      <Typography variant="h1" gutterBottom className={classes.h1}>The Search</Typography>
      <Search />
    </Container>
  )
}
