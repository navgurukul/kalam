import React, {Component} from "react";
import AdmissionsDash from "./AdmissionsDash";

class PendingInterview extends Component {
    render() {
        return <AdmissionsDash fetchPendingInterviewDetails={true}/>
    }
}

export default PendingInterview;