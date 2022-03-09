import React from "react";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@material-ui/core/styles";
import GlobalService from "../services/GlobalService";
import { theme } from "../theme/theme";
import Loader from "./Loader";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  innerTable: {
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    marginTop: "5",
    marginBottom: "5",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
      marginTop: 5,
      marginBottom: 5,
    },
  },
  clear: {
    clear: "both",
  },
}));

const MainLayout = (props) => {
  const classes = useStyles();
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <div className={classes.clear}></div>
        <MUIDataTable
          title={props.title}
          columns={props.columns}
          data={props.data}
          icons={GlobalService.tableIcons}
          options={{
            headerStyle: {
              color: theme.palette.primary.main,
            },
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            selectableRows: "none",
            toolbar: false,
            filtering: true,
            filter: true,
            filterType: "doprdown",
            responsive: "stacked",
            textLabels: {
              body: {
                noMatch: props.showLoader ? (
                  <Loader />
                ) : (
                  "Sorry, there is no matching data to display"
                ),
              },
            },
          }}
        />
      </ThemeProvider>
    </Box>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   fetchingStart: () => dispatch(changeFetching(true)),
//   fetchingFinish: () => dispatch(changeFetching(false)),
//   usersSetup: (users) => dispatch(setupUsers(users)),
// });

// export default withStyles(styles)(
//   connect(undefined, mapDispatchToProps)(MainLayout)
// );

export default MainLayout;
