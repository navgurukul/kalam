import React from "react";
import { useTimer } from "react-timer-hook";

const Timer = ({ expiryTimestamp }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => alert("Time Over"),
  });

  // const time = expiryTimestamp.toISOString().substr(11, 8);
  // console.log("expiryTimestamp", expiryTimestamp)

  // console.log("hours", hours)
  // console.log("minutes", minutes)
  // console.log("seconds", seconds)

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        Time Remaining: <span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
    </div>
  );
};

export default Timer;
