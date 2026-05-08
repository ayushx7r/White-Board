import {useContext, useState} from 'react'
import classes from './ColorPicker.module.css'
import { COLORS } from '../../constants.js'
import BoardContext from '../../store/BoardContext.js'
import ToolContext from '../../store/ToolContext.js'
import CustomPicker  from "./CustomPicker.jsx"

const ColorPicker = ({children, handleColorChange, currColor, handlePickerClick, currPicker, innerRef}) => {
    const {currTool} = useContext(BoardContext);
    const [isPicker , setIsPicker] = useState(false);
    const {state} = useContext(ToolContext);
    
    const handleClick = (color) => {
        handleColorChange(color, currTool);
    }

    const curr = (children === "Stroke") ? 'stroke' : 'fill';
    
  return (
    <div className={classes.container}>
      <p className={classes.label}> {children} </p>
      
      <div className={classes.colorPicker}>
        <div className={classes.picker} ref={innerRef}>
          <div 
            className={`${classes.color} ${classes.mainColor}`} 
            style={{backgroundColor : state[currTool][curr]}} 
            onClick={() => handlePickerClick(curr)}
          ></div>
          
          {currPicker[curr] && (
            <div className={classes.customPickerWrapper}>
              <CustomPicker color={state[currTool][curr]} onChange={handleClick} />
            </div>
          )}
        </div>

        <div className={classes.divider}></div>

        <div className={classes.colors}>
          {Object.keys(COLORS).map((el) => 
              <div 
                className={`${classes.colorBox} ${(COLORS[el] === currColor) ? classes.active : ""}`} 
                key={el} 
                onClick={() => handleClick(COLORS[el])}
              >
                  <div 
                    className={`${classes.color} ${COLORS[el] === "transparent" ? classes.transparentPattern : ""}`} 
                    style={{backgroundColor : COLORS[el]}}
                  ></div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker;