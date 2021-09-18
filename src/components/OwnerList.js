import React from 'react'
import { forwardRef } from 'react'

import { connect } from 'react-redux'
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Moment from 'react-moment'
import axios from 'axios'
import { Box, Link } from '@material-ui/core'
import { theme } from '../theme/theme'
import { withRouter } from 'react-router-dom'
import MainLayout from './MainLayout'
import { Button } from '@material-ui/core'
import AddOwner from './AddOwner'

const baseUrl = process.env.API_URL

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '80vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      marginTop: 5,
      marginBottom: 5
    }
  }
})

const columns = [
  {
    name: 'id',
    label: 'Edit',
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => {
        return (
          <AddOwner value = {value} isEdit = {true}/>
        );
      },
    }
  },
  {
    name: 'user.user_name',
    label: 'Name',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'available',
    label: 'Available',
    options: {
      filter: true,
      sort: true,
      customBodyRender: value => {
        console.log(value)
        return value ? 'Yes' : 'No'
      }
    }
  },

  {
    name: 'createdOrUpdated_at',
    label: 'When',
    options: {
      filter: false,
      sort: false,
      customBodyRender: value => {
        return (
          <Moment format='D MMM YYYY' withTitle>
            {value}
          </Moment>
        )
      }
    }
  },
  {
    name: 'pending_interview_count',
    label: 'Pending Interviews',
    options: {
      filter: false,
      sort: false
    }
  },
  {
    name: 'type',
    label: 'Interviews Assigned',
    options: {
      filter: false,
      sort: false,
      customBodyRender: value => {
        return value.map(v => `${v} `)
      }
    }
  },
  {
    name: 'max_limit',
    label: 'Assigned Interviews Limit' ,
    options: {
      filter: false,
      sort: false,
    }
  }
]

export class PartnerList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
  }

  render = () => {
    const { classes } = this.props
    return (
      <Box mt={2}>
        <MuiThemeProvider theme={theme}>
          <div className={classes.innerTable}>
            <AddOwner value='komal' />
            <MainLayout
              title={'Owner'}
              columns={columns}
              data={this.state.data}
              showLoader={true}
            />
          </div>
        </MuiThemeProvider>
      </Box>
    )
  }

  componentDidMount () {
    this.fetchOwners()
  }

  async fetchOwners () {
    const dataURL = baseUrl + 'owner'
    const response = await axios.get(dataURL)
    this.setState({ data: response.data.data })
  }
}

export default withRouter(withStyles(styles)(PartnerList))
