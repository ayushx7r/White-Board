import {useContext, useState} from 'react'
import classes from './ColorPicker.module.css'
import { COLORS } from '../../constants.js'
import BoardContext from '../../store/BoardContext.js'
import ToolContext from '../../store/ToolContext.js'


const ColorPicker = ({children, handleColorChange, currColor}) => {
    const {currTool} = useContext(BoardContext);
    const handleClick = (color) => {
        handleColorChange(color);
    }
    
  return (
    <div className={classes.container}>
      <b> {children} </b>
      <div className={classes.colors}>
        {Object.keys(COLORS).map((el) => 
            <div className={`${(COLORS[el] == currColor) ? classes.active : ""} ${classes.colorBox}`} key={el} onClick={() => handleClick(COLORS[el])}>
                <div className={classes.color} style={{backgroundColor : COLORS[el]}}></div>
            </div>
        )}
        
      </div>
    </div>
  )
}

export default ColorPicker
