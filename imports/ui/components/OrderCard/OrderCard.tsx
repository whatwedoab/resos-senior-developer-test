import {
  Card,
  CardContent,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import React, {ReactNode} from 'react'
import {Order} from '../../../../types/Order'

type Props = {
  order: Order
  children?: ReactNode
}

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    fontWeight: 'bold',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}))

export function OrderCard({order, children}: Props) {
  const classes = useStyles()
  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4" className={classes.cardHeader}>
          Order
        </Typography>

        <Typography variant="body2">
          {order.date} {order.time}
        </Typography>

        <Paper elevation={0}>
          <Typography variant="overline">Guest</Typography>
          <Typography variant="body1">{order.guest.name}</Typography>
          <Typography variant="body2">{order.guest.email}</Typography>
          <Typography variant="body2">{order.guest.phone}</Typography>
        </Paper>

        <Divider />

        <Paper elevation={0}>
          <Typography variant="overline">Customer</Typography>
          <Typography variant="body1">{order.customer.name}</Typography>
          <Typography variant="body2">
            {order.customer.emails?.join(', ')}
          </Typography>
          <Typography variant="body2">
            {order.customer.phones?.join(', ')}
          </Typography>
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
