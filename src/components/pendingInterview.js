import React from "react";
import AdmissionsDash from "./AdmissionsDash";

const PendingInterview = () => {
  return <AdmissionsDash fetchPendingInterviewDetails={true} />;
};

export default PendingInterview;
