import React from 'react';
import FeedbackbleStageWiseDangling from './FeedbackbleStageWiseDangling';
import StageWiseGenderDistribution from './StageWiseGenderDistribution';
import Grid from '@material-ui/core/Grid';

export class ReportContainer extends React.Component {
    render() {
        return <Grid container spacing={2} style={{padding: 16}}>
            <Grid item xs={12} sm={6}>
                <center><h3>Need to be resolved quickly</h3></center>
                <FeedbackbleStageWiseDangling />
            </Grid>
            <Grid item xs={12} sm={6}>
                <center><h3>All Data</h3></center>
                <StageWiseGenderDistribution />
            </Grid>
        </Grid>
    }
}

export default ReportContainer;