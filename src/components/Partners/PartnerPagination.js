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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { history } from '../../providers/routing/app-history';

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

function EnhancedTable({ data }) {
  console.log(data, '---------');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState('');
  const [updatedPartners, setUpdatedPartners] = React.useState([]);
  const [ascending, setAscending] = React.useState(1);

  console.log(updatedPartners, '9990000000');
  const updatedData = async () => {
    await setUpdatedPartners(Object.assign([], data));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event,) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
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
      if (updatedPartners.length < 1) {
        updatedData();
      } else if (value) {
        const filterBySearchedValue = data.filter((element) => element.name.toLowerCase().includes(value));
        setUpdatedPartners(filterBySearchedValue);
      } else {
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
        // console.log(j.priority,"jjjjjjjjjjjjjjjjj");
        if (i === j.priority) {
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
      if (calculation + i.minWidth < screenSize) {
        finallist.push(i);
      }
      calculation += i.minWidth;
    }
    if (finallist.length === 0) {
      finallist.push(GetData()[0]);
    }
    // console.log(finallist, 'finallist names, that which I need show');
    return finallist;
  }

  const currentPage = () => {
    if (updatedPartners.length < page * rowsPerPage) {
      return [0, updatedPartners.length];
    }
    return [page * rowsPerPage, (page * rowsPerPage) + rowsPerPage];
  };

  const sortbyNames = () => {
    console.log(currentPage(), 'Function');
    console.log(ascending, 'AScending;;;;;;;;;;;;;;');
    if (ascending === 1) {
      const sortedData = updatedPartners.sort((a, b) => {
        const fa = a.name.toLowerCase();
        const fb = b.name.toLowerCase();
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
    } else if (ascending === 2) {
      setAscending(1);
      setUpdatedPartners(data);
    } else {
      const reverseData = updatedPartners.reverse();
      setAscending(2);
      setUpdatedPartners(reverseData);
    }
  };
  return (
    <div>
      <Paper>
        <TableContainer>
          <Toolbar>
            <Grid item xs={6}>
              <Typography variant="h5" id="tableTitle" component="div">
                Partners List
              </Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <TextField onChange={onChange} value={value} label="Search" />
              <IconButton color="primary" aria-label="upload picture" component="span" onClick={sortbyNames}>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Toolbar>
          <Table
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                {name().map((e) => (e.name === 'button' ? <TableCell align="center" style={{ minWidth: e.minWidth }}>Edit</TableCell>
                  : <TableCell align="center" style={{ minWidth: e.minWidth }}>{e.name.replace(e.name.charAt(0), e.name.charAt(0).toUpperCase())}</TableCell>))}

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
