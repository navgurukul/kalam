import React from "react";

export const AssessmentAttempts = (props) => {
  const { assessmentId, partnerId } = props;
  return (
    <>
      Hi {partnerId} {assessmentId}
    </>
  );
};

export default AssessmentAttempts;
