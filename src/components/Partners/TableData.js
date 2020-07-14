import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

const TableData = [
  {
    name: 'name',
    priority: 1,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  }, {
    name: 'id',
    priority: 3,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'notes',
    priority: 5,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'slug',
    priority: 4,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e[this.name]}</TableCell>);
    },
  },
  {
    name: 'button',
    priority: 2,
    minWidth: 200,
    render: function Show({ EachRowData, onClick, page, screenSize, updatedTable,value}) {      return (
        <TableCell align="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => onClick({ EachRowData, page, screenSize, updatedTable,value})}
          >
            Update
          </Button>
        </TableCell>
      );
    },
  },
];

export default TableData;
