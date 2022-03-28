import React from "react";
import FeedbackableStageWiseDangling from "./FeedbackableStageWiseDangling";
import StageWiseGenderDistribution from "./StageWiseGenderDistribution";
import Grid from "@mui/material/Grid";

const ReportContainer = () => {
  return (
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
};

export default ReportContainer;
