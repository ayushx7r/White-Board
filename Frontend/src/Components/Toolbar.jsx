import { useContext } from 'react'
import classes from './Toolbar.module.css'
import ToolItem from './ToolItem'
import  ToolContext from '../store/ToolContext.js'
import BoardContext from '../store/BoardContext';
import { LuSlash } from "react-icons/lu";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle, FaLongArrowAltRight } from "react-icons/fa";
import { TOOLS } from '../constants'


const Toolbar = () => {
  const {currTool, handleToolChange} = useContext(BoardContext);

  return (
    <div className={classes.container}>
      <ToolItem className = {currTool == TOOLS.LINE ? classes.active : ""} onClick={() => handleToolChange(TOOLS.LINE)}><LuSlash/></ToolItem>
      <ToolItem className = {currTool == TOOLS.RECT ? classes.active : ""} onClick={() => handleToolChange(TOOLS.RECT)}><MdOutlineRectangle/> </ToolItem>
      <ToolItem className = {currTool == TOOLS.CIRCLE ? classes.active : ""} onClick={() => handleToolChange(TOOLS.CIRCLE)}><FaRegCircle/></ToolItem>
      <ToolItem className = {currTool == TOOLS.ARROW ? classes.active : ""} onClick={() => handleToolChange(TOOLS.ARROW)}><FaLongArrowAltRight/></ToolItem>
    </div>
  )
}

export default Toolbar
