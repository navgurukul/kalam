import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import LazyLoading from '../../components/LazyLoading';

import {
  updateValueX, updateValueY, incrementValueZ, selectors,
} from './store';

// This is lazy loading example
const LazyExample = LazyLoading(() => import('../../components/Example/Example'));

class ExampleView extends Component {
  state = {
    myArbitraryNumber: Math.floor(Math.random() * 10000),
    currentTime: new Date(),
  }

  render() {
    const { myArbitraryNumber, currentTime } = this.state;
    return (
      <Fragment>
        <LazyExample {...this.props} />
        <h2>This framework supports i18n and i10n out of the box.</h2>
        <p>Hello Visitor</p>
        <p>{`A locallized random number: ${myArbitraryNumber}`}</p>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  valueX: selectors.selectValueX(state),
  valueY: selectors.selectValueY(state),
  valueZ: selectors.selectValueZ(state),

});

const mapDispatchToProps = (dispatch) => ({
  moreActions: bindActionCreators({
    updateValueX,
    updateValueY,
    incrementValueZ,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExampleView);
