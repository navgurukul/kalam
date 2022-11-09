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

const baseUrl = import.meta.env.VITE_API_URL;

const OutreachDetails = () => {
  const classes = useStyles();
  const [outreachDetails, setOutReachDetails] = React.useState({
    details: [],
    teamList: [],
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}outreach/records`)
      .then((res) => {
        setOutReachDetails({
          outreachDetails: res.data,
          listOfOutreachTeam: Object.keys(res.data),
        });
      })
      .catch((err) => console.error(err));
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
            {outreachDetails.teamList.map((item) => (
              <TableRow key={item}>
                <TableCell className={classes.tableCell}>{item}</TableCell>
                <TableCell className={classes.tableCell}>
                  {outreachDetails.details[item].partners.length}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {outreachDetails.details[item].partners.reduce(
                    (acc, curr) => acc + Object.values(curr)[0],
                    0
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
// export default withStyles(styles)(OutreachDetails);
export default OutreachDetails;
