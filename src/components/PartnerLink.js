import React from 'react';
// import Link from 'react-router-dom';

export class PartnerLink extends React.Component {

  render = () => {

    const url = "/partner/"+this.props.partnerId
    return <a href={url}>{this.props.partnerId}</a>
    // return <Link to={url}>{this.props.partnerId}</Link>

  }
}

export default PartnerLink