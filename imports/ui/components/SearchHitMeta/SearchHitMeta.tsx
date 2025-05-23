import {makeStyles, Paper} from '@material-ui/core'
import React from 'react'
import {SearchHit} from '../../../api/Search/server/SearchMethods'

type Props = {
  hit: SearchHit<unknown>
}

const useStyles = makeStyles((theme) => ({
  hitMeta: {
    background: theme.palette.action.focus,
    padding: theme.spacing(1),
    fontSize: '0.8125em',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}))

export function SearchHitMeta({hit}: Props) {
  const classes = useStyles()
  return (
    <Paper elevation={0} className={classes.hitMeta}>
      <code>Score: {hit.score.toFixed(2)}</code>
      {hit.highlights.map((highlight) => (
        <code key={highlight.path}>
          {highlight.path}:{' '}
          {highlight.texts.map((t) => `"${t.value}" (${t.type})`).join(', ')}
        </code>
      ))}
    </Paper>
  )
}
