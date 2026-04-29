import {useContext, useState} from 'react'
import classes from './ColorPicker.module.css'
import { COLORS } from '../../constants.js'
import BoardContext from '../../store/BoardContext.js'
import ToolContext from '../../store/ToolContext.js'
import CustomPicker  from "./CustomPicker.jsx"


const ColorPicker = ({children, handleColorChange, currColor, handlePickerClick, currPicker}) => {
    const {currTool} = useContext(BoardContext);
    const [isPicker , setIsPicker] = useState(false);
    const {state} = useContext(ToolContext);
    const handleClick = (color) => {
        handleColorChange(color, currTool);
    }

    const curr = (children == "Stroke") ? 'stroke' : 'fill';
    
  return (
    <div className={classes.container}>
      <b> {children} </b>
      <div className={classes.colorPicker}>
        <div className={classes.picker}>
          <div className={`${classes.color} ${classes.mainColor}`} style={{backgroundColor : state[currTool][curr]}} onClick={() => handlePickerClick(curr)}></div>
          {currPicker[curr] && <CustomPicker className={classes.customPicker} color={state[currTool][curr]} onChange={handleClick} />}
        </div>
        <div className={classes.colors}>
          {Object.keys(COLORS).map((el) => 
              <div className={`${(COLORS[el] == currColor) ? classes.active : ""} ${classes.colorBox}`} key={el} onClick={() => handleClick(COLORS[el])}>
                  <div className={classes.color} style={{backgroundColor : COLORS[el]}}></div>
              </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default ColorPicker
