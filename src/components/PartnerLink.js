import React from "react";
import { Link } from "react-router-dom";

export class PartnerLink extends React.Component {
  render = () => {
    const { text } = this.props;

    return (
      <div>
        <Link
          target="_blank"
          style={{ color: "#f05f40" }}
          to={{
            pathname: this.props.url,
          }}
        >
          {text}
        </Link>
      </div>
    );
  };
}

export default PartnerLink;
