import {useRef, useEffect, useLayoutEffect, useContext} from 'react'
import Toolbar from '../Toolbar/Toolbar.jsx'
import BoardContext from '../../store/BoardContext'; 
import rough from 'roughjs/bin/rough'
import Toolbox from '../Toolbox/Toolbox';
import { CURR_STATE, TOOLS } from '../../constants.js';
import ToolContext from '../../store/ToolContext.js';

const Board = () => {
    const canvasRef = useRef();
    const { currTool, currPos, currState, elements, handleMouseDown, handleMouseMove, handleMouseUp } = useContext(BoardContext);
    const {state} = useContext(ToolContext);
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
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

  return (
    <>  
        <Toolbar currTool={currTool} />
        <Toolbox />
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onPointerDown={handleMouseDown} onPointerMove={handleMouseMove} onPointerUp={handleMouseUp} style={{touchAction: "none"}}></canvas>
    </>
  )
}

export default Board
