import React, { PureComponent } from 'react';
import Partners from '../Partners/PartnersFile';
import TableData from './TableData';

const Uidata = [
  {
    name: 'students',
    initialValues: {
      ListOfData: [],
      isDialogOpen: false,
      RowData: null,
    },
  },
];

class UIData extends PureComponent {
  render() {
    return (
      <Partners Uidata={Uidata} TableData={TableData} />
    );
  }
}

export default UIData;
