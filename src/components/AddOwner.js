import React from 'react'
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import Select from 'react-select'
import { Modal } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

import axios from 'axios'

import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText
} from '@material-ui/core'

import { withSnackbar } from 'notistack'

import { withRouter } from 'react-router-dom'
import { ContactlessOutlined } from '@material-ui/icons'

const baseUrl = process.env.API_URL
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: 400
  },
  root: {
    maxWidth: 450,
    margin: 'auto',
    marginTop: '20px'
  },

  addIcon: {
    position: 'absolute',
    marginLeft: '60%',
    top: '9px'
  },
  text: {
    marginBottom: theme.spacing(1)
  },
  btn: {
    marginTop: theme.spacing(4)
  }
})

export class AddOwner extends React.Component {
  constructor () {
    super()
    this.state = {
      dialogOpen: false,
      data: [],
      ownerName: '',
      onwerId: null,
      availablity: null,
      stage: null,
      limit: undefined
    }
  }

  componentDidMount () {
    axios.get(`${baseUrl}users/getall`).then(response => {
      this.setState({
        data: response.data.data
      })
      console.log(response, 'res')
    })
  }

  openDialog = () => {
    this.setState({
      dialogOpen: true
    })
  }

  handleClose = () => {
    this.setState({
      dialogOpen: false
    })
  }

  getStage = event => {
    const newStages = event && event.map(x => x.value)
    this.setState({
      stage: newStages
    })
  }

  handleChange = name => event => {
    const { value, label } = event
    if (name === 'ownerName') {
      this.setState({ ownerName: label, onwerId: value })
    } else {
      this.setState({
        [name]: value ? (value === 'Yes' ? true : false) : event.target.value
      })
    }
    // console.log()
  }

  onSubmit = () => {
    const { ownerName, onwerId, availablity, stage, limit } = this.state
    axios
      .post(`${baseUrl}owner`, {
        user_id: onwerId,
        available: availablity,
        max_limit: limit,
        type: stage
      })
      .then(response => {
        console.log(response, 'response')
      })
  }

  openModel = () => {
    this.setState({
      dialogOpen: true
    })
  }
  render = () => {
    const { classes, value, isEdit } = this.props
    const { data, ownerName, onwerId, availablity, stage, limit } = this.state
    console.log(data, ownerName, onwerId, availablity, stage, limit)
    console.log(this.props.value, 'komalbhatt')
    return (
      <div>
        {isEdit ? (
          <EditIcon onClick={this.openModel} style={{ cursor: 'pointer' }} />
        ) : (
          <Button
            variant='contained'
            color='primary'
            onClick={this.openDialog}
            className={classes.btn}
          >
            Add Owner
          </Button>
        )}

        <Modal
          open={this.state.dialogOpen}
          onClose={this.handleClose}
          onOpen={this.openDialog}
        >
          <Card className={classes.root}>
            <form className={classes.container}>
              <FormControl>
                <Select
                  name='ownerName'
                  // value={this.dataType}
                  onChange={this.handleChange('ownerName')}
                  options={data.map(x => {
                    return { value: x.id, label: x.user }
                  })}
                  placeholder={'Select Owner'}
                  isClearable={false}
                  closeMenuOnSelect={true}
                />
                <FormHelperText className={classes.text} id='my-helper-text'>
                  Please select owner
                </FormHelperText>
              </FormControl>

              <FormControl>
                <Select
                  name='availablity'
                  // value={this.dataType}
                  onChange={this.handleChange('availablity')}
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ].map(x => {
                    return { value: x.value, label: x.label }
                  })}
                  placeholder={'Select Availablity'}
                  isClearable={false}
                  closeMenuOnSelect={true}
                />
                <FormHelperText className={classes.text} id='my-helper-text'>
                  Select Yes/No
                </FormHelperText>
              </FormControl>

              <FormControl>
                <Select
                  name='stage'
                  isMulti
                  onChange={this.getStage}
                  options={[
                    {
                      value: 'EnglishInterview',
                      label: 'English Interview Pending (2nd Round)'
                    },
                    {
                      value: 'AlgebraInterview',
                      label: 'Algebra Interview Pending (3rd Round)'
                    },
                    {
                      value: 'CultureFitInterview',
                      label: 'Culture Fit Interview Pending (4th Round)'
                    }
                  ].map(x => {
                    return { value: x.value, label: x.label }
                  })}
                  placeholder={'Select Stage'}
                  isClearable={false}
                  closeMenuOnSelect={true}
                />
                <FormHelperText className={classes.text} id='my-helper-text'>
                  Stage select kariye jo aap owner ko assign karna chahate ho.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor='partnerNotes'>Interview Limit</InputLabel>
                <Input
                  type='number'
                  aria-describedby='my-helper-text'
                  name='limit'
                  // value={this.state.limit}
                  onChange={this.handleChange('limit')}
                />
                <FormHelperText className={classes.text} id='my-helper-text'>
                  Ek student kitne interviews le sakta hai.
                </FormHelperText>
              </FormControl>

              <Button
                variant='contained'
                color='primary'
                onClick={this.onSubmit}
                className={classes.btn}
              >
                {isEdit ? 'Edit Owner' : 'Add Owner'}
              </Button>
            </form>
          </Card>
        </Modal>
      </div>
    )
  }
}

export default withSnackbar(withRouter(withStyles(styles)(AddOwner)))
