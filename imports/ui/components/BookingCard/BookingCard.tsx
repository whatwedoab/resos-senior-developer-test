import {
  Card,
  CardContent,
  Chip,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import React, {ReactNode} from 'react'
import {Booking} from '../../../../types/Booking'

type Props = {
  booking: Booking
  children?: ReactNode
}

const useStyles = makeStyles((theme) => ({
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
}))

export function BookingCard({booking, children}: Props) {
  const classes = useStyles()
  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4" className={classes.cardHeader}>
          Booking
        </Typography>

        <Typography variant="body2">
          {booking.date} {booking.time}
        </Typography>

        <Paper elevation={0}>
          <Typography variant="overline">Guest</Typography>
          <Typography variant="body1">{booking.guest?.name}</Typography>
          <Typography variant="body2">{booking.guest?.email}</Typography>
          <Typography variant="body2">{booking.guest?.phone}</Typography>
        </Paper>

        <Divider />

        <Paper elevation={0}>
          <Typography variant="overline">Tables</Typography>
          <Paper elevation={0} className={classes.chipsContainer}>
            {booking.tables?.map((table) => (
              <Chip key={table._id} label={table.name} />
            ))}
          </Paper>
        </Paper>

        {!!children && (
          <>
            <Divider />
            {children}
          </>
        )}
      </CardContent>
    </Card>
  )
}
