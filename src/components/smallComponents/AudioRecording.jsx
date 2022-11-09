import React from "react";
import ReactPlayer from "react-player";

export default ({ audioUrl }) => {
  const [playing, setPlaying] = React.useState(false);
  return (
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
  );
};
