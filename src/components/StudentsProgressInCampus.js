import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Typography,
  CardContent,
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
});

class StudentsProgressInCampus extends Component {
  render() {
    const { classes } = this.props;
    console.log(this.props, "this.props");
    return (
      <div>
        <Container className={classes.container}>
          <Grid item xs={12} style={{ marginBottom: 40 }}>
            <Typography variant="h4">
              {" "}
              {/* Hello, {partnerName} Foundation */}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup
              size="large"
              color="primary"
              aria-label="large outlined primary button group"
            >
              <Button>Progress Made</Button>
              <Button>Tabular Data</Button>
            </ButtonGroup>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(StudentsProgressInCampus);
