import React from 'react';
export class PartnerLink extends React.Component {

  render = () => {

    const url = "partner/"+this.props.partnerId
    return <a href={url}>{this.props.partnerId}</a>

  }
}

export default PartnerLink