/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

function EnhancedTable({
  data, onClick, PageShowing, StylingForRow, EditedData, isAddRow, isEditRow, TableData, NameLIst,
}) {
  console.log(onClick, 'nnnnn');
  const [page, setPage] = React.useState(PageShowing);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState('');
  const [updatedTable, setUpdatedTable] = React.useState([]);
  const [ascending, setAscending] = React.useState(1);
  const [columnToSort, setColumnToSort] = React.useState('');


  // console.log(updatedTable, '9990000000');

  const updatedData = async () => {
    await setUpdatedTable(Object.assign([], data));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };
  function getWindowDimensions() {
    const screenSize = window.screen.width;
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
      if (updatedTable.length < 1) {
        updatedData();
      } else if (value) {
        const filterBySearchedValue = data.filter((element) => (element.name ? element.name.toLowerCase().includes(value) : 'no data'));
        setUpdatedTable(filterBySearchedValue);
      } else {
        setUpdatedTable(data);
      }
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [value, data]);

    return windowDimensions;
  }

  function GetData() {
    const l = [];
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 1; i <= TableData.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const j of TableData) {
        // console.log(j.priority,"jjjjjjjjjjjjjjjjj");

        if (i === j.priority) {
          l.push(j);
          break;
        }
      }
    }
    return l;
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const { screenSize } = useWindowDimensions();

  function name() {
    const finallist = [];
    let calculation = 0;
    const SizeOfTable = isAddRow || isEditRow ? (0.75 * screenSize - 16 - 20) : screenSize;
    console.log(screenSize, 'size of window');
    console.log(SizeOfTable, 'size f table');

    // eslint-disable-next-line no-restricted-syntax
    for (const i of GetData()) {
      if (calculation + i.minWidth < SizeOfTable) {
        finallist.push(i);
      }
      calculation += i.minWidth;
    }
    if (finallist.length === 0) {
      finallist.push(GetData()[0]);
    }
    console.log(finallist, 'finallist');
    return finallist;
  }

  const currentPage = () => {
    if (updatedTable.length < page * rowsPerPage) {
      return [0, updatedTable.length];
    }
    return [page * rowsPerPage, (page * rowsPerPage) + rowsPerPage];
  };

  const handleSort = (columnName) => {
    setColumnToSort(columnName);
    if (ascending === 1) {
      const sortedData = updatedTable.sort((a, b) => {
        let fa; let
          fb;
        if (typeof a[columnName] === 'number') {
          fa = a[columnName];
          fb = b[columnName];
        } else if (a[columnName] && b[columnName]) {
          fa = a[columnName].toLowerCase();
          fb = b[columnName].toLowerCase();
        } else {
          fa = a[columnName];
          fb = b[columnName];
        }
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      setAscending(0);
      setUpdatedTable(sortedData);
    } else if (ascending === 2) {
      setAscending(1);
      setUpdatedTable(Object.assign([], data));
    } else {
      const reverseData = updatedTable.reverse();
      setAscending(2);
      setUpdatedTable(reverseData);
    }
  };
  return (
    <Container style={(rowsPerPage > 5) ? { height: '510px', overflow: 'auto' } : null} component={Paper}>
      {/* <Container style={{ height: '510px', overflow: 'auto' }} component={Paper}> */}
      <TableContainer>
        <Toolbar>
          <Grid item xs={6}>
            <Typography variant="h5" component="div">
              {`${NameLIst} List`}
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <TextField onChange={onChange} value={value} label="Search" />
          </Grid>
        </Toolbar>
        <Table
          aria-labelledby="tableTitle"
          aria-label="enhanced table"
          style={{ padding: 0, margin: 0 }}
        >
          <TableHead>
            <TableRow>
              {name().map((e) => (e.name === 'button' ? <TableCell align="center" style={{ minWidth: e.minWidth }}>Edit</TableCell>
                : (
                  <TableCell align="center" onClick={() => { handleSort(e.name); }} style={{ minWidth: e.minWidth, cursor: 'pointer' }}>
                    {e.name.replace(e.name.charAt(0), e.name.charAt(0).toUpperCase())}
                    {columnToSort === e.name
                      ? (ascending === 2
                        ? <ArrowUpwardIcon color="primary" style={{ marginBottom: '-7px', marginLeft: '5px' }} />
                        : ascending === 1
                          ? null : <ArrowDownwardIcon color="primary" style={{ marginBottom: '-7px', marginLeft: '5px' }} />)
                      : null}
                  </TableCell>
                )))}
            </TableRow>
          </TableHead>

          <TableBody>
            {updatedTable
              ? updatedTable
                .slice(currentPage()[0], currentPage()[1])
                .map((EachRowData) => {
                  return (
                    <TableRow
                      hover
                      key={EachRowData.id}
                      style={(StylingForRow && EditedData.id === EachRowData.id) ? { backgroundColor: 'red' } : { backgroundColor: '' }}
                    >
                      {name().map((e) => (e.name === 'button' ? e.render({
                        EachRowData, onClick, page, screenSize,
                      }) : (e.name === 'Online class Tag' ? e.render({ EachRowData, onClick }) : e.render(EachRowData))))}

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

    </Container>
  );
}

export default EnhancedTable;
