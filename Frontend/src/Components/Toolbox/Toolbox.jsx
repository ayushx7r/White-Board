import React, { useContext, useRef, useState } from 'react'
import classes from './Toolbox.module.css'
import { PhotoshopPicker, SketchPicker } from 'react-color';
import ColorPicker from '../ColorPicker/ColorPicker.jsx';
import ToolContext from '../../store/ToolContext.js';
import BoardContext from '../../store/BoardContext.js';
import { isClosed } from '../../utils/math.js'

const Toolbox = () => {
  const {state, handleStrokeColorChange, handleFillShape, handleStrokeWidthChange} = useContext(ToolContext);
  const min = 1;
  const max = 10;
  const percentage = ((state.strokeWidth - min) / (max - min)) * 100;

  // Create a dynamic background style
  const trackStyle = {
    background: `linear-gradient(to right, ${state.stroke} ${percentage}%, #444 ${percentage}%)`
  };
    const {currTool} = useContext(BoardContext);
    const strokeWidthRef = useRef();
    const handleStrokeWidth = () => {
      handleStrokeWidthChange(strokeWidthRef.current.value);
    }
  return (
    <div className={classes.container}>
        <ColorPicker currColor={state.stroke} handleColorChange={handleStrokeColorChange} >Stroke</ColorPicker>
        {isClosed(currTool) && <ColorPicker currColor={state.fill} handleColorChange={handleFillShape} >Fill</ColorPicker>}
        <p>Storke Size : {state.strokeWidth} </p>
        <input style={trackStyle} className={classes.slider} ref={strokeWidthRef} value={state.strokeWidth} onChange={handleStrokeWidth} type='range' min={min} max={max} />

    </div>
  )
}

export default Toolbox
