import { useContext } from 'react'
import classes from './Toolbar.module.css'
import ToolItem from './ToolItem.jsx'
import  ToolContext from '../../store/ToolContext.js'
import BoardContext from '../../store/BoardContext.js';
import { LuSlash } from "react-icons/lu";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle, FaDownload, FaLongArrowAltRight, FaEraser } from "react-icons/fa";
import { IoIosBrush } from "react-icons/io";
import { RiText } from "react-icons/ri";
import { TOOLS } from '../../constants.js'


const Toolbar = () => {
  const {currTool, handleToolChange} = useContext(BoardContext);
  const handleDownloadClick = () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // 1. Create a temporary canvas of the same size
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // 2. Fill the background with white
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 3. Draw your original canvas content on top of the white
    tempCtx.drawImage(canvas, 0, 0);

    // 4. Export the temporary canvas
    const dataURL = tempCanvas.toDataURL("image/jpeg", 1.0);
    
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = "board.jpg";
    a.click();
  }

  return (
    <div className={classes.container}>
      <ToolItem className={currTool == TOOLS.BRUSH? classes.active : ""} onClick={() => handleToolChange(TOOLS.BRUSH)}><IoIosBrush/></ToolItem>
      <ToolItem className = {currTool == TOOLS.LINE ? classes.active : ""} onClick={() => handleToolChange(TOOLS.LINE)}><LuSlash/></ToolItem>
      <ToolItem className = {currTool == TOOLS.RECT ? classes.active : ""} onClick={() => handleToolChange(TOOLS.RECT)}><MdOutlineRectangle/> </ToolItem>
      <ToolItem className = {currTool == TOOLS.CIRCLE ? classes.active : ""} onClick={() => handleToolChange(TOOLS.CIRCLE)}><FaRegCircle/></ToolItem>
      <ToolItem className = {currTool == TOOLS.ARROW ? classes.active : ""} onClick={() => handleToolChange(TOOLS.ARROW)}><FaLongArrowAltRight/></ToolItem>
      <ToolItem className = {currTool == TOOLS.ERASER ? classes.active : ""} onClick={() => handleToolChange(TOOLS.ERASER)}><FaEraser /></ToolItem>
      <ToolItem className = {currTool == TOOLS.TEXT ? classes.active : ""} onClick={() => handleToolChange(TOOLS.TEXT)}><RiText /></ToolItem>
      <ToolItem  onClick={handleDownloadClick}><FaDownload /></ToolItem>
    </div>
  )
}

export default Toolbar
