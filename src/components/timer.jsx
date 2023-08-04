import React, { useState, useEffect } from 'react';

const Timer = ({ endTime }) => {
	console.log(endTime)
  const [remainingTime, setRemainingTime] = useState(0);
  
  useEffect(() => {
    const updateTime = () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
      const timeDifference = endTime - currentTime;
      if (timeDifference > 0) {
        setRemainingTime(timeDifference);
      }

    };

    // Update remaining time every second
    const interval = setInterval(updateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    return <h1 style={{color:'white'}}>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</h1>;
  };
  return(
  <div style = {{textAlign:'center'}}>

    {formatTime(remainingTime)}
  </div>
  )
};

export {Timer};
