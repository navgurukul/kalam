import "date-fns";
import React from "react";
import { Modal, Button, Typography, Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import DetailsIcon from "@mui/icons-material/Details";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import theme from "../../theme";
import { tableIcons } from "../../services/GlobalService";

dayjs.extend(customParseFormat);
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/

const getModalStyle = () => {
  const top = 50; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "90vh",
    width: "90%",
  };
};

const useStyles = makeStyles((_theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [_theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: _theme.palette.background.paper,
    boxShadow: _theme.shadows[5],
    padding: _theme.spacing(4),
    outline: "none",
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: "22px",
      },
    },
  },
}));

const createdAtComponent = (value) => (
  <p>{dayjs(value).format("D MMM YYYY")}</p>
);

const StageTransitionsStudentStatus = ({ rowData, allStages }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  const columns = React.useMemo(
    () => [
      {
        label: "Stage",
        name: "to_stage",
        options: {
          customBodyRender: (value) => allStages[value],
        },
      },
      {
        label: "When?",
        name: "created_at",
        options: {
          customBodyRender: createdAtComponent,
        },
      },
    ],
    []
  );

  const getMuiTheme = () =>
    createTheme({
      overrides: {
        MUIDataTableBodyCell: {
          stackedCommon: {
            height: "auto !important",
            // width: 'calc(50% - 80px) !important'
          },
        },
      },
    });

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };
  const modalStyle = getModalStyle();
  return !modalOpen ? (
    <div>
      <Button color="primary" align="right" onClick={handleOpen}>
        <DetailsIcon color="primary" />
        &nbsp;&nbsp;
      </Button>
    </div>
  ) : (
    <Modal open={modalOpen} onClose={handleClose}>
      <Box style={modalStyle} className={classes.paper}>
        <ThemeProvider theme={getMuiTheme()}>
          <Typography variant="h5" id="modal-title">
            Transitions
          </Typography>
          <br />
          <MUIDataTable
            columns={columns}
            data={rowData}
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
              filtering: true,
              filter: true,
              filterType: "doprdown",
              responsive: "stacked",
            }}
          />
        </ThemeProvider>
      </Box>
    </Modal>
  );
};

export default StageTransitionsStudentStatus;
