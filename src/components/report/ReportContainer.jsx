import React from "react";
import Grid from "@mui/material/Grid";
import FeedbackableStageWiseDangling from "../feedback/FeedbackableStageWiseDangling";
import StageWiseGenderDistribution from "./StageWiseGenderDistribution";

const ReportContainer = () => (
  <Grid container spacing={2} style={{ padding: 16 }}>
    <Grid item xs={12} sm={6}>
      <center>
        <h3>Need to be resolved quickly</h3>
      </center>
      <FeedbackableStageWiseDangling />
    </Grid>
    <Grid item xs={12} sm={6}>
      <center>
        <h3>All Data</h3>
      </center>
      <StageWiseGenderDistribution />
    </Grid>
  </Grid>
);

export default ReportContainer;
