import React from "react";
import { useParams } from "react-router-dom";

const AssessmentAttempts = () => {
  const { assessmentId } = useParams();
  return <>Hi {assessmentId}</>;
};

export default AssessmentAttempts;
