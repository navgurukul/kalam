import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
      .catch(() => {
        // console.error(error);
      });
  }, []);

  return (
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
            {state.listOfOutreachTeam.map((item) => {
              let countOfStudent = 0;
              return (
                <TableRow key={item}>
                  <TableCell className={classes.tableCell}>{item}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {state.outreachDetails[item][".partners"].length}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {state.outreachDetails[item][".partners"].forEach(() => {
                      countOfStudent += Object.values(item)[0];
                    })}
                    {countOfStudent}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
// export default withStyles(styles)(OutreachDetails);
export default OutreachDetails;
