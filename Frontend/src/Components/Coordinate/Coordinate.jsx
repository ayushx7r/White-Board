import React from 'react';
import classes from './Coordinate.module.css';
import { TbCrosshair } from "react-icons/tb"; 

const Coordinates = ({ currPos, offset, scale}) => {
    const x = (currPos.x - offset.x) / scale;
    const y = (currPos.y - offset.y) / scale;
  return (
    <div className={classes.container}>
      <TbCrosshair className={classes.icon} />
      <div className={classes.values}>
        <span className={classes.label}>
          X <span className={classes.number}>{Math.round(x || 0)}</span>
        </span>
        <div className={classes.divider}></div>
        <span className={classes.label}>
          Y <span className={classes.number}>{Math.round(y || 0)}</span>
        </span>
      </div>
    </div>
  )
}

export default Coordinates;