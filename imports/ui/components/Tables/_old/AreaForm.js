import React from 'react'
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator'
import Select from '@material-ui/core/Select'
import {isAppActive} from '../../../modules/restaurants'
import Loading from '../../Loading/Loading'
import {generateRwgSnackbarString} from '../../../modules/util'
import {withStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import FilledInput from '@material-ui/core/FilledInput'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'

const T = i18n.createComponent()

const styles = (theme) => ({
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
})

class AreaForm extends React.Component {
  constructor(props) {
    super(props)

    console.log('AreaForm constructor')

    const {area} = this.props

    this.state = {
      name: area && area.name,
      bookable: area ? area.bookable : true,
      bookableOnline: area ? area.bookableOnline : true,
      bookingPriority: (area && area.bookingPriority) || 5,
      internalNote: area && area.internalNote,
      loading: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCheckedChange = this.handleCheckedChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {area} = nextProps
    const {loading} = this.state
    const {area: propsArea} = this.props

    // Update state if selected area changed
    if (!_.isEqual(propsArea, area) && !loading) {
      this.setState({
        name: area && area.name,
        bookable: area ? area.bookable : true,
        bookableOnline: area ? area.bookableOnline : true,
        bookingPriority: (area && area.bookingPriority) || 5,
        note: area && area.note,
        internalNote: area && area.internalNote,
        loading: false,
      })
    }
  }

  handleChange = (event) => {
    const field = event.target.name
    const {value} = event.target
    this.setState({[field]: value})
  }

  handleCheckedChange = (field) => (event, checked) => {
    this.setState({[field]: checked})
  }

  handleSubmit = () => {
    const {area, restaurant, onClose, enqueueSnackbar} = this.props
    const {
      name,
      bookable,
      bookableOnline,
      bookingPriority,
      note,
      internalNote,
    } = this.state

    this.setState({
      loading: true,
    })

    // Build area object
    const doc = {
      name,
      bookable,
      bookableOnline: bookable && bookableOnline,
      bookingPriority: parseInt(bookingPriority),
      note,
      internalNote,
    }

    if (area && area._id) {
      // Update existing
      Meteor.call(
        'seatingAreas.update',
        restaurant._id,
        area._id,
        doc,
        (error) => {
          if (error) {
            // Error!
            enqueueSnackbar(i18n.__('common.error.something_went_wrong'), {
              variant: 'error',
            })
          } else {
            enqueueSnackbar(
              isAppActive(restaurant, 'reserveWithGoogle')
                ? generateRwgSnackbarString(
                    i18n.__('settings.tables.area.updated'),
                  )
                : i18n.__('settings.tables.area.updated'),
              {variant: 'success'},
            )
            // Success
            this.setState({
              loading: false,
            })

            // Close form dialog
            onClose()
          }
        },
      )
    } else {
      // Add new
      Meteor.call('seatingAreas.insert', restaurant._id, doc, (error) => {
        if (error) {
          // Error!
          enqueueSnackbar(i18n.__('common.error.something_went_wrong'), {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(
            isAppActive(restaurant, 'reserveWithGoogle')
              ? generateRwgSnackbarString(i18n.__('settings.tables.area.added'))
              : i18n.__('settings.tables.area.added'),
            {variant: 'success'},
          )
          // Success
          this.setState({
            loading: false,
          })

          // Close form dialog
          onClose()
        }
      })
    }
  }

  render() {
    const {area, open, onClose, classes, fullScreen} = this.props
    const {
      name,
      bookable,
      bookableOnline,
      bookingPriority,
      note,
      internalNote,
      loading,
    } = this.state

    return (
      <Dialog
        open={!!open}
        onClose={onClose}
        className={classes.root}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
      >
        <ValidatorForm
          onSubmit={this.handleSubmit}
          // eslint-disable-next-line no-console
          onError={(errors) => console.log(errors)}
        >
          <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
            {area ? (
              <T>settings.tables.area.edit</T>
            ) : (
              <T>settings.tables.area.add</T>
            )}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={7}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextValidator
                      label={i18n.__('settings.tables.area.name')}
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      fullWidth
                      variant="filled"
                      validators={['required']}
                      errorMessages={[i18n.__('common.error.required')]}
                      disabled={loading}
                      autoComplete="off"
                      helperText={i18n.__('settings.tables.area.name_help')}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="filled" fullWidth>
                      <InputLabel htmlFor="bookingPriority">
                        <T>settings.tables.area.priority</T>
                      </InputLabel>
                      <Select
                        value={bookingPriority}
                        onChange={this.handleChange}
                        disabled={loading}
                        input={
                          <FilledInput
                            name="bookingPriority"
                            id="bookingPriority"
                          />
                        }
                      >
                        <MenuItem value="10">
                          10 -&nbsp;<T>common.high</T>
                        </MenuItem>
                        <MenuItem value="9">9</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                        <MenuItem value="6">6</MenuItem>
                        <MenuItem value="5">
                          5 -&nbsp;<T>common.medium</T>
                        </MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="1">
                          1 -&nbsp;<T>common.low</T>
                        </MenuItem>
                      </Select>
                      <FormHelperText>
                        <T>settings.tables.area.priority_help</T>
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      label={i18n.__('settings.tables.area.note')}
                      name="note"
                      value={note}
                      onChange={this.handleChange}
                      fullWidth
                      variant="filled"
                      disabled={loading}
                      autoComplete="off"
                      multiline
                      minRows="2"
                      helperText={i18n.__('settings.tables.area.note_help')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      label={i18n.__('settings.tables.area.internal_note')}
                      name="internalNote"
                      value={internalNote}
                      onChange={this.handleChange}
                      fullWidth
                      variant="filled"
                      disabled={loading}
                      autoComplete="off"
                      multiline
                      minRows="2"
                      helperText={i18n.__(
                        'settings.tables.area.internal_note_help',
                      )}
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
                          checked={bookable}
                          onChange={this.handleCheckedChange('bookable')}
                          value="bookable"
                          color="primary"
                        />
                      }
                      label={i18n.__('settings.tables.area.bookable')}
                    />
                    <FormHelperText>
                      <T>settings.tables.area.bookable_help</T>
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={bookable && bookableOnline}
                          onChange={this.handleCheckedChange('bookableOnline')}
                          value="bookableOnline"
                          color="primary"
                        />
                      }
                      label={i18n.__('settings.tables.area.bookable_online')}
                    />
                    <FormHelperText>
                      <T>settings.tables.area.bookable_online_help</T>
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
              <T>common.save</T>
            </Button>
            <Button onClick={onClose} disabled={loading}>
              <T>common.cancel</T>
            </Button>
            {loading && <Loading inline />}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(AreaForm))
