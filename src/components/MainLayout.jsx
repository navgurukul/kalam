import React from "react";
import Box from "@mui/material/Box";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import GlobalService from "../services/GlobalService";
import Loader from "./Loader";
import theme from "../theme";

const useStyles = makeStyles(() => ({
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
  const { data, columns, title, showLoader } = props;
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <div className={classes.clear} />
        <MUIDataTable
          title={title}
          columns={columns}
          data={data}
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
            // filtering: true,
            // filter: true,
            // filterType: "dropdown",
            responsive: "vertical",
            textLabels: {
              body: {
                noMatch: showLoader ? (
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
