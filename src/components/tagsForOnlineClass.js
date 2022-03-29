import React from "react";
import { makeStyles } from "@material-ui/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { allTagsForOnlineClass } from "../config";

import Menu from "@material-ui/core/Menu";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import axios from "axios";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(1),
    maxWidth: 200,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  fab: {
    margin: theme.spacing(1),
    width: 40,
    height: 40,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

const ChipsArray = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => async () => {
    if (value) {
      const newData = props.allTags;
      newData.push({ key: newData.length - 1, label: value });
      addTags(newData);
    }
    setAnchorEl(null);
  };

  const handleDelete = (chipToDelete) => async () => {
    const newData = props.allTags.filter(
      (chip) => chip.key !== chipToDelete.key
    );
    addTags(newData);
  };

  const addTags = (newData) => {
    const { studentId, rowMetatable, change } = props;
    const columnIndex = rowMetatable.columnIndex;

    let tag = [];
    newData.map((data) => tag.push(data.label));
    const tags = tag.join(", ");

    axios.post(`${baseUrl}students/tag/${studentId}`, {
      tag: tags,
    });
    change(tags, columnIndex);
  };
  const { allTags } = props;

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      {allTags.length ? (
        <Paper component="ul" className={classes.root}>
          {allTags.map((data) => {
            return (
              <li key={data.key}>
                <Chip
                  variant="outlined"
                  color="primary"
                  size="small"
                  label={(
                    data.label.charAt(0).toUpperCase() + data.label.slice(1)
                  )
                    .match(/[A-Z][a-z]+/g)
                    .join(" ")}
                  onDelete={handleDelete(data)}
                  className={classes.chip}
                />
              </li>
            );
          })}
        </Paper>
      ) : null}
      <Fab color="primary" className={classes.fab} onClick={handleClick}>
        <AddIcon />
      </Fab>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose(null)}
      >
        {allTagsForOnlineClass.map((data, index) => (
          <MenuItem value={data} onClick={handleClose(data)} key={index}>
            {(data.charAt(0).toUpperCase() + data.slice(1))
              .match(/[A-Z][a-z]+/g)
              .join(" ")}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default ChipsArray;
