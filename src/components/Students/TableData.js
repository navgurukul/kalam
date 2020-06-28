import React from 'react';
import TableCell from '@material-ui/core/TableCell';

const TableData = [
  {
    name: 'name',
    priority: 1,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  }, {
    name: 'id',
    priority: 3,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'gender',
    priority: 2,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name] === 1 ? 'female' : 'male' }</TableCell>);
    },
  },
  {
    name: 'state',
    priority: 4,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'city',
    priority: 5,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'pinCode',
    priority: 6,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'stage',
    priority: 7,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'percentageIn12th',
    priority: 8,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'partnerId',
    priority: 9,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'partnerName',
    priority: 10,
    minWidth: 100,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
];

export default TableData;
