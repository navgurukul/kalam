import React from "react";
import Box from "@mui/material/Box";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { tableIcons } from "../../services/GlobalService";
import Loader from "../ui/Loader";
import theme from "../../theme";

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

const MainLayout = ({
  data,
  columns,
  options,
  title,
  showLoader,
  onDownload,
  tableBodyMaxHeight,
}) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <div className={classes.clear} />
        <MUIDataTable
          title={title}
          columns={columns}
          data={data}
          icons={tableIcons}
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
            onDownload: onDownload || null,
            tableBodyMaxHeight: tableBodyMaxHeight || "64vh",
            textLabels: {
              body: {
                noMatch: showLoader ? (
                  <Loader />
                ) : (
                  "Sorry, there is no matching data to display"
                ),
              },
            },
            ...(options || {}),
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
