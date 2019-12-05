import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { EventEmitter } from './events';

const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {

  constructor (props) {
    super(props);
    const { rowData } = props;
  }

  handleChange = selectedValue => {
    // const { selectedOption } = this.state
    const { rowData } = this.props
    // this.state.selectedOption = selectedValue;
    EventEmitter.dispatch("stageChange", {selectedValue: selectedValue, rowData: rowData});
  }

  render = () => {
    const { allStagesOptions, rowData } = this.props;
    const selectedValue = { value: rowData.stage, label: rowData.stageTitle }

    return <Select
        className={"filterSelectStage"}
        // defaultValue={selectedValue}
        value={selectedValue}
        onChange={this.handleChange}
        options={allStagesOptions}
        // placeholder={"Select "+this.props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
    />
  }
}

export default StageSelect;