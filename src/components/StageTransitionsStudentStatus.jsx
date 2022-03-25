import "date-fns";
import React, { memo } from "react";
import { Modal, Button, Typography, Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import Moment from "react-moment";
import { createTheme, ThemeProvider, makeStyles } from "@mui/styles";

import DetailsIcon from "@mui/icons-material/Details";
import theme from "../theme";
import GlobalService from "../services/GlobalService";
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

const StageTransitionsStudentStatus = (props) => {
  const { allStages } = props;
  const classes = useStyles();
  const [state, setState] = React.useState({
    data: [],
    modalOpen: false,
  });
  const columns = [
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
        customBodyRender: memo((value) => (
          <Moment format="D MMM YYYY" withTitle>
            {value}
          </Moment>
        )),
      },
    },
  ];

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
    setState({
      ...state,
      modalOpen: false,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      modalOpen: true,
    });
  };

  const { rowData } = props;
  const modalStyle = getModalStyle();
  return !state.modalOpen ? (
    <div>
      <Button color="primary" align="right" onClick={handleOpen}>
        <DetailsIcon color="primary" />
        &nbsp;&nbsp;
      </Button>
    </div>
  ) : (
    <Modal open={state.modalOpen} onClose={handleClose}>
      <Box style={modalStyle} className={classes.paper}>
        <ThemeProvider theme={getMuiTheme()}>
          <Typography variant="h5" id="modal-title">
            Transitions
          </Typography>
          <br />
          <MUIDataTable
            columns={columns}
            data={rowData}
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
            }}
          />
        </ThemeProvider>
      </Box>
    </Modal>
  );
};

export default StageTransitionsStudentStatus;
