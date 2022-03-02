import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import AudioPlayer from "material-ui-audio-player";
import React, { Fragment } from "react";

const muiTheme = createTheme({});

const useStyles = makeStyles((theme) => {
  return {
    root: {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    loopIcon: {
      color: "#3f51b5",
      "&.selected": {
        color: "#0921a9",
      },
      "&:hover": {
        color: "#7986cb",
      },
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    playIcon: {
      color: "#f50057",
      "&:hover": {
        color: "#ff4081",
      },
    },
    volumeIcon: {
      color: "rgba(0, 0, 0, 0.54)",
    },
    volumeSlider: {
      color: "black",
    },
    progressTime: {
      color: "rgba(0, 0, 0, 0.54)",
    },
    mainSlider: {
      color: "#3f51b5",
      "& .MuiSlider-rail": {
        color: "#7986cb",
      },
      "& .MuiSlider-track": {
        color: "#3f51b5",
      },
      "& .MuiSlider-thumb": {
        color: "#303f9f",
      },
    },
  };
});
export default (props) => {
  const { audioUrl } = props;
  return (
    <Fragment>
      <ThemeProvider theme={muiTheme}>
        <AudioPlayer
          width="400px"
          useStyles={useStyles}
          src={audioUrl}
          loop={true}
        />
      </ThemeProvider>
      ;
    </Fragment>
  );
};
