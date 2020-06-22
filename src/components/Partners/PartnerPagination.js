import React, { useEffect, useState } from 'react';
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

const Styling = [
  ['name', 1, 200], ['id', 3, 200], ['notes', 2, 200], ['slug', 4, 200], ['button', 5, 200],
];

function EnhancedTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function getWindowDimensions() {
    const screenSize = window.screen.width;
    console.log(screenSize, '--------------');
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
      screenSize,
    };
  }

  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }

  function GetData() {
    const l = [];
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 1; i <= Styling.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const j of Styling) {
        if (i === j[1]) {
          l.push(j);
          break;
        }
      }
    }
    // console.log(l, 'Prints list according to priority wise');
    return l;
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const { screenSize } = useWindowDimensions();

  function name() {
    const finallist = [];
    let calculation = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const i of GetData()) {
      if (calculation + i[2] < screenSize) {
        finallist.push(i);
      }
      calculation += i[2];
    }
    if (finallist.length === 0) {
      finallist.push(GetData()[0]);
    }
    // console.log(finallist, 'finallist names, that which I need show');
    return finallist;
  }
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
                {name().map((e) => (e[0] === 'button' ? <TableCell align="center" style={{ minWidth: e[2] }}>Edit</TableCell>
                  : <TableCell align="center" style={{ minWidth: e[2] }}>{e[0].replace(e[0].charAt(0), e[0].charAt(0).toUpperCase())}</TableCell>))}

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
                        key={partner.name}
                      >
                        {name().map((e) => (e[0] === 'button' ? (
                          <TableCell style={{ minWidth: e[2] }} align="center">
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
                        )
                          : <TableCell align="center" style={{ minWidth: e[2] }}>{partner[e[0]]}</TableCell>))}


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

export default EnhancedTable;
