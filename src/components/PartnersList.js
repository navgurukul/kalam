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
import { history } from '../providers/routing/app-history'
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  space: {
    marginTop: "25px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'right',
    color: theme.palette.text.secondary,
  },
}));


export default function EnhancedTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [partners, setPartners] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [updatedPartners, setUpdatedPartners] = React.useState([]);
  const [ascending, setAscending] = React.useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  React.useEffect(() => {
    if (partners.length < 1) {
      fetchData();
    }
    else if (value) {
      const filterBySearchedValue = partners.filter(data => data.name.toLowerCase().includes(value));
      setUpdatedPartners(filterBySearchedValue);
    }
    else {
      setUpdatedPartners(partners)
    }
  }, [value])

  const fetchData = async () => {
    const response = await axios.get('http://join.navgurukul.org/api/partners');
    const data = response.data.data
    setPartners(data);
    setUpdatedPartners(response.data.data);
    console.log(partners, "thing");

  }

  const sortbyNames = () => {
    console.log(partners, "nothing");

    if (ascending) {
      console.log(partners, "True");
      const sortedData = updatedPartners.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      setAscending(false);
      setUpdatedPartners(sortedData);
    }
    else {
      console.log(partners, "false");
      const reverseData = updatedPartners.reverse();
      setAscending(true);
      setUpdatedPartners(reverseData)
    }

  }

  const onChange = (e) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }
  const handleChangeRowsPerPage = (event, ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const classes = useStyles();
  console.log(updatedPartners, "UPDATEDPARtner")
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, partners.length - page * rowsPerPage);
  return (
    <div>

      <Paper className={classes.space}>
        <TableContainer >
          <Toolbar>
            <Grid item xs={6}>
              <Typography variant="h4" id="tableTitle" component="div" >
                Partners List
        </Typography>
            </Grid>
            <Grid item xs={6} className={classes.paper}>
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
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Edit</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {updatedPartners.length > page * rowsPerPage
                ? updatedPartners
                  .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                  .map((partner) => {
                    console.log(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                    console.log(value, "VALUE ==========")
                    console.log(updatedPartners, "PARtner")
                    console.log(partner.name, "NAME---------------------------");
                    return (
                      <TableRow
                        hover
                        key={partner.id}
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

                : updatedPartners
                  .map((partner) => {
                    return (
                      <TableRow
                        hover
                        key={partner.id}
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
            count={partners.length}
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