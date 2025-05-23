import {makeStyles} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog, {DialogProps} from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FilledInput from '@material-ui/core/FilledInput'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch, {SwitchProps} from '@material-ui/core/Switch'
import {Meteor} from 'meteor/meteor'
import {ChangeEvent, useCallback, useEffect, useState} from 'react'
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator'
import {Restaurant} from '../../../../types/Restaurant'
import {SeatingArea} from '../../../../types/SeatingArea'
import {useTranslator} from '../../../i18n/i18n'
import {isAppActive} from '../../modules/restaurants/index'
import {generateRwgSnackbarString} from '../../modules/util/index'
import {Loading} from '../Loading/Loading'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
    },
  },
  dialogActions: {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3),
  },
  dialogContent: {
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 136px)',
      overflow: 'auto',
    },
  },
  submitButton: {
    minWidth: 200,
  },
  deleteButton: {
    minWidth: 100,
  },
}))

type Props = Pick<DialogProps, 'open' | 'fullScreen'> & {
  onClose: () => void
  area: SeatingArea
  restaurant: Restaurant
  enqueueSnackbar: (
    message: string,
    options?: {variant: 'success' | 'error'},
  ) => void
}

export default function AreaForm({
  area: areaProp,
  open,
  onClose,
  fullScreen,
  restaurant,
  enqueueSnackbar,
}: Props) {
  const t = useTranslator()
  const classes = useStyles()
  const [area, setArea] = useState<SeatingArea>(areaProp)
  const [loading, setLoading] = useState(false)

  // Update state if selected area changed
  useEffect(() => {
    setArea(areaProp)
  }, [areaProp])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true)

      const result = await new Promise<string>((resolve, reject) => {
        if (area && area._id) {
          // Update existing
          Meteor.call(
            'seatingAreas.update',
            restaurant._id,
            area._id,
            area,
            (error: Meteor.Error | null) => {
              if (error) reject(error)
              else resolve('settings.tables.area.updated')
            },
          )
        } else {
          // Add new
          Meteor.call(
            'seatingAreas.insert',
            restaurant._id,
            area,
            (error: Meteor.Error | null) => {
              if (error) reject(error)
              else resolve('settings.tables.area.added')
            },
          )
        }
      })

      enqueueSnackbar(
        isAppActive(restaurant, 'reserveWithGoogle')
          ? generateRwgSnackbarString(t(result))
          : t(result),
        {variant: 'success'},
      )

      // Close dialog
      onClose()
    } catch (e) {
      enqueueSnackbar(t('common.error.something_went_wrong'), {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [area, t, enqueueSnackbar, onClose, restaurant])

  const handleChange = (e: ChangeEvent<{name?: string; value: unknown}>) => {
    if (!e.target.name) return
    setArea({...area, [e.target.name]: e.target.value})
  }

  const handleCheckedChange: SwitchProps['onChange'] = (e, checked) => {
    setArea({...area, [e.target.name]: checked})
  }

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      className={classes.root}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm
        onSubmit={handleSubmit}
        onError={(errors) => console.log(errors)}
      >
        <DialogTitle id="form-dialog-title">
          {t(area ? 'settings.tables.area.edit' : 'settings.tables.area.add')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextValidator
                    label={t('settings.tables.area.name')}
                    name="name"
                    value={area.name}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    validators={['required']}
                    errorMessages={[t('common.error.required')]}
                    disabled={loading}
                    autoComplete="off"
                    helperText={t('settings.tables.area.name_help')}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="filled" fullWidth>
                    <InputLabel htmlFor="bookingPriority">
                      {t('settings.tables.area.priority')}
                    </InputLabel>
                    <Select
                      value={area.bookingPriority}
                      onChange={handleChange}
                      disabled={loading}
                      input={
                        <FilledInput
                          name="bookingPriority"
                          id="bookingPriority"
                        />
                      }
                    >
                      <MenuItem value={10}>
                        10 -&nbsp;{t('common.high')}
                      </MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={5}>
                        5 -&nbsp;{t('common.medium')}
                      </MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={1}>1 -&nbsp;{t('common.low')}</MenuItem>
                    </Select>
                    <FormHelperText>
                      {t('settings.tables.area.priority_help')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    label={t('settings.tables.area.note')}
                    name="note"
                    value={area.note}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    disabled={loading}
                    autoComplete="off"
                    multiline
                    minRows="2"
                    helperText={t('settings.tables.area.note_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    label={t('settings.tables.area.internal_note')}
                    name="internalNote"
                    value={area.internalNote}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    disabled={loading}
                    autoComplete="off"
                    multiline
                    minRows="2"
                    helperText={t('settings.tables.area.internal_note_help')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="bookable"
                        checked={area.bookable}
                        onChange={handleCheckedChange}
                        value="bookable"
                        color="primary"
                      />
                    }
                    label={t('settings.tables.area.bookable')}
                  />
                  <FormHelperText>
                    {t('settings.tables.area.bookable_help')}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="bookableOnline"
                        checked={area.bookable && area.bookableOnline}
                        onChange={handleCheckedChange}
                        value="bookableOnline"
                        color="primary"
                        disabled={!area.bookable}
                      />
                    }
                    label={t('settings.tables.area.bookable_online')}
                  />
                  <FormHelperText>
                    {t('settings.tables.area.bookable_online_help')}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submitButton}
          >
            {t('common.save')}
          </Button>
          <Button onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          {loading && <Loading inline />}
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}
