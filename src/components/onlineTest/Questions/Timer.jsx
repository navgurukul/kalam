import { Typography } from "@mui/material";
import React from "react";
import { useTimer } from "react-timer-hook";

const Timer = ({ expiryTimestamp, callback, lang }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      callback();
      alert("Time Over");
    },
  });

  const formatUnit = (unit) => {
    if (parseInt(unit, 10) < 10) return `0${unit}`;
    return unit;
  };

  const timeRemaining = {
    en: "Time Remaining: ",
    hi: "शेष समय: ",
    ma: "शिल्लक वेळ: ",
  };

  // const time = expiryTimestamp.toISOString().substr(11, 8);
  // console.log("expiryTimestamp", expiryTimestamp)

  // console.log("hours", hours)
  // console.log("minutes", minutes)
  // console.log("seconds", seconds)

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4">
        {timeRemaining[lang]} <span>{formatUnit(hours)}</span>:
        <span>{formatUnit(minutes)}</span>:<span>{formatUnit(seconds)}</span>
      </Typography>
    </div>
  );
};

export default Timer;

Timer.defaultProps = {
  callback: () => {},
};
