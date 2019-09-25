import React from 'react';
import {withRouter} from 'react-router-dom';

export class AssessmentAttempts extends React.Component {
  render() {
    return "Hi" + this.props.partnerId+" " + this.props.assessmentId;
  }
}

export default withRouter(AssessmentAttempts);