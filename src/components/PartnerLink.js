import React from 'react';
export class PartnerLink extends React.Component {

  render = () => {

    const url = "partner/" + this.props.partnerId
    return <a href={url} style={{ color: "#f05f40" }}>{this.props.name}</a>

  }
}

export default PartnerLink