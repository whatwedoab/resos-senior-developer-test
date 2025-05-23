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
import {Customer} from '../../../../types/Customer'

type Props = {
  customer: Customer
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

export function CustomerCard({customer, children}: Props) {
  const classes = useStyles()
  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4" className={classes.cardHeader}>
          {customer.name}
        </Typography>

        <Paper elevation={0}>
          <Typography variant="body2">{customer.emails?.join(', ')}</Typography>
          <Typography variant="body2">{customer.phones?.join(', ')}</Typography>
        </Paper>

        <Divider />

        <Paper elevation={0}>
          <Typography variant="overline">Tags</Typography>
          <Paper elevation={0} className={classes.chipsContainer}>
            {customer.tags?.map((tag) => <Chip key={tag} label={tag} />)}
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
