import React, { useContext, useRef, useState, useEffect } from 'react'
import classes from './Toolbox.module.css'
import ColorPicker from '../ColorPicker/ColorPicker.jsx';
import ToolContext from '../../store/ToolContext.js';
import BoardContext from '../../store/BoardContext.js';
import { hasStroke, isClosed } from '../../utils/math.js'
import { TOOLS } from '../../constants.js';
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const Toolbox = () => {
  const { state, handleStrokeColorChange, handleFillShape, handleStrokeWidthChange } = useContext(ToolContext);
  const { currTool } = useContext(BoardContext);
  
  if(currTool == TOOLS.ERASER) return <></>
  
  const min = currTool == TOOLS.TEXT ? 16 : 1;
  const max = currTool == TOOLS.TEXT ? 60 : 10;
  const steps = currTool == TOOLS.TEXT ? 2 : 1;

  const [currPicker, setCurrPicker] = useState({stroke: false, fill: false});
  const strokePickerRef = useRef();
  const fillPickerRef = useRef();

  const handlePickerClick = (curr) => {
    setCurrPicker((state) => {
      const newState = {stroke: false, fill: false};
      newState[curr] = !state[curr];
      return newState;
    })
  }

  useEffect(() => {
    const strokePicker = strokePickerRef.current;
    const fillPicker = fillPickerRef.current;
    const handleClick = (e) => {
      if(strokePicker?.contains(e.target) || fillPicker?.contains(e.target)) return;
      setCurrPicker({stroke: false, fill: false});
    }
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    }
  })

  const percentage = ((state[currTool].strokeWidth - min) / (max - min)) * 100;
  
  const trackStyle = {
  // 1. Paint a solid image of your active color
  backgroundImage: `linear-gradient(${currTool == TOOLS.ERASER ? "#fff" : state[currTool].stroke}, ${currTool == TOOLS.ERASER ? "#fff" : state[currTool].stroke})`,
  
  // 2. Set the width of that color to your exact percentage, and height to 100%
  backgroundSize: `${percentage}% 100%`,
  backgroundRepeat: "no-repeat",
  
  // 3. Set the underlying track to your aesthetic glass gray
  backgroundColor: "rgba(255, 255, 255, 0.1)"
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
    <div className={`${classes.container} ${collapsed ? classes.collapsed : ""}`}>
      <div className={classes.pickerGroup}>
        {hasStroke(currTool) && <ColorPicker innerRef={strokePickerRef} currPicker={currPicker} handlePickerClick={handlePickerClick} currColor={state[currTool].stroke} handleColorChange={handleStrokeColorChange} >Stroke</ColorPicker>}
        {isClosed(currTool) && <ColorPicker innerRef={fillPickerRef} currPicker={currPicker} handlePickerClick={handlePickerClick} currColor={state[currTool].fill} handleColorChange={handleFillShape} >Fill</ColorPicker>}
      </div>

      <div className={classes.sliderGroup}>
        <p className={classes.label}>
          {currTool == TOOLS.TEXT ? "Font Size" : "Stroke Size"} <span>{state[currTool].strokeWidth}</span>
        </p>
        <input 
          style={trackStyle} 
          className={classes.slider} 
          ref={strokeWidthRef} 
          value={state[currTool].strokeWidth} 
          onChange={handleStrokeWidth} 
          type='range' 
          step={steps} 
          min={min} 
          max={max} 
        />
      </div>

      <button className={classes.collapseBtn} onClick={handleCollapse}> 
        <FaArrowRightArrowLeft/> 
      </button>
    </div>
  )
}

export default Toolbox;