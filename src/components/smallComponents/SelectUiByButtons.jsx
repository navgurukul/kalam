import React from "react";
import {
  Button,
  ButtonGroup,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
  space: {
    marginBottom: 10,
  },
}));
const SelectUiByButtons = (props) => {
  const classes = useStyles();
  const { name, progressMade, tabularData, showGraphData } = props;
  return (
    <Container className={classes.container}>
      <Grid item xs={12} className={classes.space}>
        <Typography variant="h4"> {name} </Typography>
      </Grid>
      <Grid item xs={12} className={classes.space}>
        <ButtonGroup
          size="large"
          color="primary"
          aria-label="large outlined primary button group"
        >
          <Button onClick={() => tabularData(true)}>Tabular Data</Button>
          <Button onClick={() => progressMade(false)}>Progress Made</Button>
          <Button onClick={() => showGraphData(null)}>Graph on Job</Button>
        </ButtonGroup>
      </Grid>
    </Container>
  );
};

export default SelectUiByButtons;
