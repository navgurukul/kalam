import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { history } from '../../providers/routing/app-history';

export default function EnhancedTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event,) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  return (
    <div>
      <Paper>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Edit</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              { data
                ? data
                  .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                  .map((partner) => {
                    return (
                      <TableRow
                        hover
                      >
                        <TableCell component="th" scope="row" padding="none" align="center">
                          {partner.name}
                        </TableCell>
                        <TableCell align="center">{partner.id}</TableCell>
                        <TableCell align="center">
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              history.push('/EditPartnerDetails', partner);
                            }}
                          >
                            Update
                          </Button>
                        </TableCell>

                      </TableRow>
                    );
                  })
                : ''
}
              {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>

      </Paper>
    </div>
  );
}
