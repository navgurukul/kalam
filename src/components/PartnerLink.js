import React from 'react';
export class PartnerLink extends React.Component {

  render = () => {

    const url = "partner/" + this.props.partnerId
    return <div>
    <a href={url} target="_blank" style={{ color: "#f05f40" }}>{this.props.name}</a>
   </div>
     

  }
}

export default PartnerLink