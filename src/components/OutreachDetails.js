import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = (theme) => ({
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
});

export class OutreachDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outreachDetails: [],
      listOfOutreachTeam: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://join.navgurukul.org/api/outreach/records")
      .then((Response) => {
        this.setState({
          outreachDetails: Response.data,
        });
        if (this.state.outreachDetails) {
          this.setState({
            listOfOutreachTeam: Object.keys(this.state.outreachDetails),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;
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
                {this.state.listOfOutreachTeam.map((item, index) => {
                    let countOfStudent = 0;
                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.tableCell}>
                          {item}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {this.state.outreachDetails[item]["partners"].length}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {this.state.outreachDetails[item]["partners"].forEach(
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
  }
}
export default withStyles(styles)(OutreachDetails);
