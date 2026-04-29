import React, { useContext, useRef, useState } from 'react'
import classes from './Toolbox.module.css'
import { PhotoshopPicker, SketchPicker } from 'react-color';
import ColorPicker from '../ColorPicker/ColorPicker.jsx';
import ToolContext from '../../store/ToolContext.js';
import BoardContext from '../../store/BoardContext.js';
import { hasStroke, isClosed } from '../../utils/math.js'
import { TOOLS } from '../../constants.js';
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const Toolbox = () => {
  const {state, handleStrokeColorChange, handleFillShape, handleStrokeWidthChange} = useContext(ToolContext);
  const {currTool} = useContext(BoardContext);

  
  const min = currTool == TOOLS.TEXT ? 16 : 1;
  const max = currTool == TOOLS.TEXT ? 60 : 10;

  const steps = currTool == TOOLS.TEXT ? 2 : 1;

  const [currPicker, setCurrPicker] = useState({stroke : false, fill : false});

  const handlePickerClick = (curr) => {
    setCurrPicker((state) => {
      const newState = {stroke : false, fill : false};
      newState[curr] = !state[curr];
      return newState;
    })
  }

  const percentage = ((state[currTool].strokeWidth - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(to right, ${currTool == TOOLS.ERASER ? "#fff" : state[currTool].stroke}, ${percentage}%, #444 ${percentage}%)`
  };

  const [collapsed, setCollapsed] = useState(false);
    const strokeWidthRef = useRef();
    const handleStrokeWidth = () => {
      handleStrokeWidthChange(strokeWidthRef.current.value, currTool);
    }

    const handleCollapse = () => {
      setCollapsed(!collapsed);
    }
  return (
    <div className={`${classes.container}  ${collapsed ? classes.collapsed : ""}`}>
        {hasStroke(currTool) && <ColorPicker currPicker={currPicker} handlePickerClick={handlePickerClick} currColor={state[currTool].stroke} handleColorChange={handleStrokeColorChange} >Stroke</ColorPicker>}
        {isClosed(currTool) && <ColorPicker currPicker={currPicker} handlePickerClick={handlePickerClick} currColor={state[currTool].fill} handleColorChange={handleFillShape} >Fill</ColorPicker>}
        <p>{currTool == TOOLS.TEXT ? "Font Size" : "Storke Size"} : {state[currTool].strokeWidth} </p>
        <input style={trackStyle} className={classes.slider} ref={strokeWidthRef} value={state[currTool].strokeWidth} onChange={() => handleStrokeWidthChange(strokeWidthRef.current.value, currTool)} type='range' step={steps} min={min} max={max} />
        <button className={classes.collapseBtn} onClick={handleCollapse}> <FaArrowRightArrowLeft/> </button>
    </div>
  )
}

export default Toolbox
