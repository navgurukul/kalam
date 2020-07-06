import React, { PureComponent } from 'react';
import Partners from './PartnersFile';
import TableData from './TableData';

const Uidata = [
  {
    name: 'Partners',
    initialValues: {
      ListOfData: [],
      isAddRow: false,
      isEditRow: false,
      EditableTableRowValues: {},
      ShowingPage: 0,
      StylingForRow: false,
      screenSize: null,
    },
  },

];

export class UIData extends PureComponent {
  render() {
    return (
      <Partners Uidata={Uidata} TableData={TableData} properties={this.props} />
    );
  }
}

export default UIData;
