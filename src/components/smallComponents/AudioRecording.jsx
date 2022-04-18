import React from "react";
import ReactPlayer from "react-player";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     [theme.breakpoints.down("sm")]: {
//       width: "100%",
//     },
//   },
//   loopIcon: {
//     color: "#3f51b5",
//     "&.selected": {
//       color: "#0921a9",
//     },
//     "&:hover": {
//       color: "#7986cb",
//     },
//     [theme.breakpoints.down("sm")]: {
//       display: "none",
//     },
//   },
//   playIcon: {
//     color: "#f50057",
//     "&:hover": {
//       color: "#ff4081",
//     },
//   },
//   volumeIcon: {
//     color: "rgba(0, 0, 0, 0.54)",
//   },
//   volumeSlider: {
//     color: "black",
//   },
//   progressTime: {
//     color: "rgba(0, 0, 0, 0.54)",
//   },
//   mainSlider: {
//     color: "#3f51b5",
//     "& .MuiSlider-rail": {
//       color: "#7986cb",
//     },
//     "& .MuiSlider-track": {
//       color: "#3f51b5",
//     },
//     "& .MuiSlider-thumb": {
//       color: "#303f9f",
//     },
//   },
// }));
export default (props) => {
  const { audioUrl } = props;
  const [playing, setPlaying] = React.useState(false);
  return (
    <>
      {/* <AudioPlayer width="400px" useStyles={useStyles} src={audioUrl} loop /> */}
      <ReactPlayer
        url={audioUrl}
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls
        volume={1}
        playbackRate={1}
        width="240px"
        height="75px"
        loop
      />
    </>
  );
};
