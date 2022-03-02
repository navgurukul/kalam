import React from "react";

export const AssessmentAttempts = (props) => {
  return (
    <React.Fragment>
      Hi {props.partnerId} {props.assessmentId}
    </React.Fragment>
  );
};

export default AssessmentAttempts;
