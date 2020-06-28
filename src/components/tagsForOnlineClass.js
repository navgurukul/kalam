import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { allTagsForOnlineClass } from '../config';
import { withSnackbar } from 'notistack';

import Menu from '@material-ui/core/Menu';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';  
import axios from 'axios';

const baseUrl = process.env.API_URL;


const useStyles = ((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(1),
    maxWidth: 200
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  fab: {
    margin: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  }
}));

class ChipsArray extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };

  handleClose = (value) => async () => {
    if(value) {
      const newData = this.props.allTags
      newData.push({key: newData.length-1, label: value})
      this.addTags(newData)
    }
    this.setState({
      anchorEl: null
    })
  };

  handleDelete = (chipToDelete) => async () => {
    const newData = this.props.allTags.filter((chip) => chip.key !== chipToDelete.key)
    this.addTags(newData)
  };

  addTags = (newData) => {
    const { studentId, rowMetatable, change } = this.props;
    const columnIndex = rowMetatable.columnIndex;
    
    let tag = []
    newData.map((data) => tag.push(data.label))
    const tags = tag.join(", ")
    
    axios.post(`${baseUrl}students/tag/${studentId}`, {
      tag: tags
    })
    change(tags, columnIndex) 
  }
  
  render() {
    const {classes ,allTags } = this.props;

    return (
      <Grid container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
      { allTags.length ?
      <Paper component="ul" className={classes.root}>
        {allTags.map((data) => {
          return (
            <li key={data.key}>
              <Chip
                variant="outlined"
                color="primary"
                size="small"
                label={(data.label.charAt(0).toUpperCase() + data.label.slice(1)).match(/[A-Z][a-z]+/g).join(" ") }
                onDelete={this.handleDelete(data)}
                className={classes.chip}
              />
            </li>
          );
        })}
      </Paper>: null } 
        <Fab color="primary" className={classes.fab} onClick={this.handleClick} >
          <AddIcon />
        </Fab>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose(null)}
        >
          { allTagsForOnlineClass.map((data) => 
            <MenuItem
              value={data}
              onClick={this.handleClose(data)}
            >
              {(data.charAt(0).toUpperCase() + data.slice(1)).match(/[A-Z][a-z]+/g).join(" ")}
            </MenuItem>
          )}
        </Menu>
    </Grid>
  );
}
}

export default withStyles(useStyles)(withSnackbar(ChipsArray));
