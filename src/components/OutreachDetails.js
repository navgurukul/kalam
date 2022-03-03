import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    overflowX: "hide",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "70px",
  },
  table: {
    minWidth: 340,
  },
  tableCell: {
    fontSize: "16px",
  },
}));

const OutreachDetails = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    outreachDetails: [],
    listOfOutreachTeam: [],
  });

  useEffect(() => {
    axios
      .get("https://join.navgurukul.org/api/outreach/records")
      .then((Response) => {
        setState((prevState) => ({
          ...prevState,
          outreachDetails: Response.data,
        }));
        if (state.outreachDetails) {
          setState((prevState) => ({
            ...prevState,
            listOfOutreachTeam: Object.keys(prevState.outreachDetails),
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log(state);

  return (
    <>
      <Container>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  {" "}
                  Outreach coordinator email
                </TableCell>
                <TableCell className={classes.tableCell}>
                  Number of partners
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {" "}
                  Number of students{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.listOfOutreachTeam.map((item, index) => {
                let countOfStudent = 0;
                console.log(countOfStudent);
                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>{item}</TableCell>
                    <TableCell className={classes.tableCell}>
                      {state.outreachDetails[item]["partners"].length}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {state.outreachDetails[item]["partners"].forEach(
                        (item) => {
                          let values = Object.values(item)[0];
                          countOfStudent = countOfStudent + values;
                        }
                      )}
                      {countOfStudent}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};
// export default withStyles(styles)(OutreachDetails);
export default OutreachDetails;
