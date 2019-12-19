// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import MaterialTable from "material-table";
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';
import { changeFetching } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';

import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';

import { EventEmitter } from './events';

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '80%',
      marginTop: 5,
      marginBottom: 5
    },
  },
  clear: {
    clear: 'both'
  }
})

export class Transition extends React.Component {

  constructor(props) {
    super(props);
    this.transitionURL = `${baseURL}students/transitionsWithFeedback/${this.props.studentId}`;
    this.state = {
      data: [],
    }
    EventEmitter.subscribe('transitionsChange'+this.props.studentId, this.transitionsChangeEvent);
  }

  transitionsChangeEvent = () => {
    this.fetchtransition();
  }

  async fetchtransition() {
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.transitionURL, {});
      const newData = response.data.data.map(v => ({ ...v, loggedInUser: this.props.loggedInUser }))
      this.setState({
        data: newData
      }, this.props.fetchingFinish)
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }

  componentDidMount() {
    this.fetchtransition();
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe('transitionsChange'+this.props.studentId);
  }

  render = () => {
    const { dataType, classes } = this.props;
    return <Box className={classes.innerTable} my={2}>
      <MaterialTable
        columns={StudentService.columnTransitions[dataType]}
        data={this.state.data}
        icons={GlobalService.tableIcons}

        options={{
          search: false,
          paging: false,
          toolbar: false,
          showTitle: false,
          headerStyle: {
            color: theme.palette.primary.main,
            zIndex: 0
          },
        }}
      />
    </Box>
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Transition)))