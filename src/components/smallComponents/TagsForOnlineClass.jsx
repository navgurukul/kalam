import React from "react";
import { makeStyles } from "@mui/styles";
import { Chip, Paper, Grid, Menu, MenuItem, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { allTagsForOnlineClass } from "../../utils/constants";
import { toTitleCase } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

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

const ChipsArray = ({ allTags, studentId, change }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const addTags = (newData) => {
    const tag = newData.map((data) => data.label).join(", ");
    axios.post(`${baseUrl}students/tag/${studentId}`, {
      tag,
    });
    change(tag);
  };

  const handleClose = async (value) => {
    if (value) {
      const newData = allTags;
      newData.push({ key: newData.length - 1, label: value });
      addTags(newData);
    }
    setAnchorEl(null);
  };

  const handleDelete = (chipToDelete) => async () => {
    const newData = allTags.filter((chip) => chip.key !== chipToDelete.key);
    addTags(newData);
  };

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      {allTags.length ? (
        <Paper component="ul" className={classes.root}>
          {allTags.map((data) => (
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
          ))}
        </Paper>
      ) : null}
      <IconButton color="primary" className={classes.fab} onClick={handleClick}>
        <AddIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        {allTagsForOnlineClass.map((data) => (
          <MenuItem value={data} onClick={() => handleClose(data)} key={data}>
            {toTitleCase(data)
              .match(/[A-Z][a-z]+/g)
              .join(" ")}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default ChipsArray;
