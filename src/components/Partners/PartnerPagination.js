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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';


const Styling = [
  {
    name: 'name',
    priority: 1,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e.name}</TableCell>);
    },
  }, {
    name: 'id',
    priority: 3,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e.id}</TableCell>);
    },
  },
  {
    name: 'notes',
    priority: 2,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e.notes}</TableCell>);
    },
  },
  {
    name: 'slug',
    priority: 4,
    minWidth: 200,
    render: function Show(e) {
      return (<TableCell align="center">{e.slug}</TableCell>);
    },
  },
  {
    name: 'button',
    priority: 5,
    minWidth: 200,
    render: function Show(e) {
      return (
        <TableCell style={{ minWidth: e[2] }} align="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/EditPartnerDetails', e);
            }}
          >
            Update
          </Button>
        </TableCell>
      );
    },
  },
];

const invertDirection = {
  asc: "desc",
  desc: "asc"
}
function EnhancedTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState("");
  const [updatedPartners, setUpdatedPartners] = React.useState([]);
  const [columnToSort, setColumnToSort] = React.useState("");
  const [ascending, setAscending] = React.useState(1);

  const updatedData = async () => {
    await setUpdatedPartners(Object.assign([], data));

  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChange = (e) => {
    setValue(e.target.value)
  }
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
      if (updatedPartners.length < 1) {
        updatedData();
      }

      else if (value) {
        const filterBySearchedValue = data.filter(element => element.name.toLowerCase().includes(value.toLowerCase()));
        setUpdatedPartners(filterBySearchedValue);
      }
      else {
        setUpdatedPartners(data);
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
    for (let i = 1; i <= Styling.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const j of Styling) {
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
    // eslint-disable-next-line no-restricted-syntax
    for (const i of GetData()) {
      if (calculation + i.minWidth < screenSize) {
        finallist.push(i);
      }
      calculation += i.minWidth;
    }
    if (finallist.length === 0) {
      finallist.push(GetData()[0]);
    }
    return finallist;
  }

  const currentPage = () => {
    if (updatedPartners.length < page * rowsPerPage) {
      return [0, updatedPartners.length]
    }
    return [page * rowsPerPage, (page * rowsPerPage) + rowsPerPage]
  }

  const handleSort = (columnName) => {
    setColumnToSort(columnName);
    if (ascending === 1) {
      const sortedData = updatedPartners.sort((a, b) => {
        let fa, fb;
        if (typeof a[columnName] === 'number') {
          fa = a[columnName];
          fb = b[columnName];
        }
        else {
          if (a[columnName] && b[columnName]) {
            fa = a[columnName].toLowerCase();
            fb = b[columnName].toLowerCase();
          }
          else {
            fa = a[columnName];
            fb = b[columnName];
          }

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
      setUpdatedPartners(sortedData);
    }
    else if (ascending === 2) {
      setAscending(1);
      setUpdatedPartners(Object.assign([], data))
    }
    else {
      const reverseData = updatedPartners.reverse();
      setAscending(2);
      setUpdatedPartners(reverseData)
    }

  }
  return (
    <div>
      <Paper>
        <TableContainer>
          <Toolbar>
            <Grid item xs={6}>
              <Typography variant="h4" id="tableTitle" component="div" >
                Partners List
        </Typography>
            </Grid>
            <Grid item xs={6} >
              <TextField onChange={onChange} value={value} label="Search" />
            </Grid>
          </Toolbar>
          <Table
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                {name().map((e) => (e.name === 'button' ? <TableCell align="center" style={{ minWidth: e.minWidth }}>Edit</TableCell>
                  : <TableCell align="center" onClick={() => { handleSort(e.name) }} style={{ minWidth: e.minWidth, cursor: 'pointer' }}>
                    {e.name.replace(e.name.charAt(0), e.name.charAt(0).toUpperCase())}
                    {columnToSort === e.name ?
                      (ascending === 2 ?
                        <ArrowUpwardIcon color="primary" align="center" style={{ marginTop: "2px", paddingTop: "5px", marginLeft: "10px" }} />
                        : ascending === 1 ?
                          null : <ArrowDownwardIcon color="primary" style={{ marginTop: "2px", paddingTop: "5px", marginLeft: "10px" }} />)
                      : null}
                  </TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedPartners
                ? updatedPartners
                  .slice(currentPage()[0], currentPage()[1])
                  .map((partner) => {
                    return (
                      <TableRow
                        hover
                        key={partner.name}
                      >
                        {name().map((e) => (
                          e.render(partner)
                        ))}


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