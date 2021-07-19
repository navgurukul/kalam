import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Typography,
  Grid,
  Container,
  withStyles,
} from "@material-ui/core";

const styles = (theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
  space: {
    marginBottom: 10,
  },
});
class SelectUiByButtons extends Component {
  render() {
    const { name, classes, progressMade, tabularData, showGraphData } =
      this.props;
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
  }
}

export default withStyles(styles)(SelectUiByButtons);
