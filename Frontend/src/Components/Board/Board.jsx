import {useRef, useEffect, useLayoutEffect, useContext} from 'react'
import Toolbar from '../Toolbar/Toolbar.jsx'
import BoardContext from '../../store/BoardContext'; 
import rough from 'roughjs/bin/rough'
import Toolbox from '../Toolbox/Toolbox';
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from '../../constants.js';
import ToolContext from '../../store/ToolContext.js';
import classes from './Board.module.css'
import History from '../History/History.jsx';

const Board = () => {
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const { currTool, currPos, currState, elements, handleMouseDown, handleMouseMove, handleMouseUp, handleTextAreaBlur } = useContext(BoardContext);
    const {state} = useContext(ToolContext);
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext("2d");
      let roughCanvas = rough.canvas(canvas);
       elements.forEach(element => {
          switch(element.type) {
            case TOOLS.CIRCLE :
            case TOOLS.LINE :
            case TOOLS.RECT :
            case TOOLS.ARROW : {
              roughCanvas.draw(element.drawable);
              break;
            }
            case TOOLS.BRUSH :
            case TOOLS.ERASER : {
              context.fillStyle = element.options.stroke;
              context.fill(element.path)
              context.restore();
              break;
            }
            case TOOLS.TEXT : {
              context.save();
              context.textBaseline = "top";
              context.font = `${element.strokeWidth}px Caveat`;
              context.fillStyle = element.stroke;

              // 1. Split the text into an array of lines
              const lines = element.text.split("\n");
              const lineHeight = element.strokeWidth; 
              lines.forEach((line, index) => {
                context.fillText(
                  line, 
                  element.x1, 
                  element.y1 + (index * lineHeight)
                );
              });

              context.restore();
              break;
            }
            default : break;
          }
            
          });
          if(currState == CURR_STATE.ERASING) {
            const { x, y} = currPos;
            context.save();
            context.beginPath();
            context.arc(x, y, state[currTool].strokeWidth*3, 0, Math.PI * 2);
            context.fillStyle = "rgba(0, 0, 0, 0.1)"
            context.fill();
            context.setLineDash([5, 5]);
            context.strokeStyle = "#333";
            context.lineWidth = 1;
            context.stroke();
            context.restore();
          }
      
      
      
      return () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    },[elements, currPos, currState]);

    useEffect(() => {
    if (currState === CURR_STATE.WRITING && textAreaRef.current) {
        // A timeout of 0ms pushes the focus to the next event loop tick
        const timeout = setTimeout(() => {
            textAreaRef.current.focus();
        }, 0);
        
        return () => clearTimeout(timeout);
    }
}, [currState]);

const handleTextChange = (e) => {
  const textarea = e.target;
  // Reset height and width to auto to shrink if text is deleted
  textarea.style.width = 'auto';
  // Set width to scrollWidth so it expands with content
  textarea.style.width = `${textarea.scrollWidth}px`;
  
  // Optional: Do the same for height if you want it to grow vertically on Enter
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

  return (
    <>  
        <Toolbar currTool={currTool} />
        <Toolbox />
        {currState == CURR_STATE.WRITING && <textarea onInput={handleTextChange} ref={textAreaRef} className={classes.textArea} style={{position : "absolute",top:elements[elements.length-1].y1, left: elements[elements.length-1].x1, fontSize: `${state[currTool].strokeWidth}px`, color : state[currTool].stroke}} onBlur={(e) => handleTextAreaBlur(e.target.value)}/>}
        <canvas id='canvas' ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onPointerDown={handleMouseDown} onPointerMove={handleMouseMove} onPointerUp={handleMouseUp} style={{touchAction: "none"}}></canvas>
        <History />
    </>
  )
}

export default Board
