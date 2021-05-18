import React from "react";
import { useTimer } from "react-timer-hook";

function Timer({ expiryTimestamp, isLoggedIn }) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => alert("Time Over"),
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        Time Remaining: <span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
    </div>
  );
}

export default Timer;
