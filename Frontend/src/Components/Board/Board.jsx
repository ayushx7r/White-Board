import {useRef, useEffect, useLayoutEffect, useContext} from 'react'
import Toolbar from '../Toolbar/Toolbar.jsx'
import BoardContext from '../../store/BoardContext'; 
import rough from 'roughjs/bin/rough'
import Toolbox from '../Toolbox/Toolbox';
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from '../../constants.js';
import ToolContext from '../../store/ToolContext.js';
import classes from './Board.module.css'
import History from '../History/History.jsx';
import Scale from '../Scale/Scale.jsx';
import Coordinates from '../Coordinate/Coordinate.jsx';

const Board = () => {
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const { currTool, currPos, currState, elements, handleMouseDown, handleMouseMove, handleMouseUp, handleCanvasScroll, handleTextAreaBlur, offset, scale, dispatchBoardState, handleSetOffset } = useContext(BoardContext);
    const {state} = useContext(ToolContext);

    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
        const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        canvas.width = width; 
        canvas.height = height;
      }

      window.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    }, [])
    useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    canvas.width = width; 
    canvas.height = height;
    
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.save();
    context.translate(offset.x, offset.y);
    context.scale(scale, scale);

    let roughCanvas = rough.canvas(canvas);

    elements.forEach(element => {
      switch(element.type) {
        case TOOLS.CIRCLE:
        case TOOLS.LINE:
        case TOOLS.RECT:
        case TOOLS.ARROW:
          roughCanvas.draw(element.drawable);
          break;

        case TOOLS.BRUSH:
        case TOOLS.ERASER:
          context.save();
          context.fillStyle = element.options.stroke;
          context.fill(element.path);
          context.restore(); 
          break;

        case TOOLS.TEXT:
          context.save();
          context.textBaseline = "top";
          context.font = `${element.strokeWidth}px Caveat`;
          context.fillStyle = element.stroke;
          const lines = element.text.split("\n");
          const lineHeight = element.strokeWidth; 
          lines.forEach((line, index) => {
            context.fillText(line, element.x1, element.y1 + (index * lineHeight));
          });
          context.restore();
          break;
        default: break;
      }
    });

    if(currState === CURR_STATE.ERASING) {
      const { x, y } = currPos;
      context.save();
      context.beginPath();
      context.arc(x, y, 16, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 255, 255, 0.1)";
      context.fill();
      context.setLineDash([5, 5]);
      context.strokeStyle = "#999";
      context.stroke();
      context.restore();
    }

    context.restore();
  }, [elements, currPos, currState, offset, scale]);

  useEffect(() => {
      if (currState === CURR_STATE.WRITING && textAreaRef.current) {
          const timeout = setTimeout(() => {
              textAreaRef.current.focus();
          }, 0);
          
          return () => clearTimeout(timeout);
      }
  }, [currState]);

  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);

  useEffect(() => {
    scaleRef.current = scale;
    offsetRef.current = offset;
  }, [scale, offset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleWheel = (e) => {
  e.preventDefault();

  const currentScale = scaleRef.current;
  const currentOffset = offsetRef.current;

  if (e.ctrlKey) {
    const zoomSensitivity = 0.005;
    const delta = -e.deltaY * zoomSensitivity;
    
    const rawNextScale = currentScale + delta;
    
    const nextScale = Math.min(Math.max(rawNextScale, 0.1), 5);
    if (nextScale === currentScale) return;
    const mouseWorldX = (e.clientX - currentOffset.x) / currentScale;
    const mouseWorldY = (e.clientY - currentOffset.y) / currentScale;

    const newOffset = {
      x: Math.round(e.clientX - mouseWorldX * nextScale),
      y: Math.round(e.clientY - mouseWorldY * nextScale)
    };

    dispatchBoardState({ 
      type: TOOL_ACTIONS.ZOOM_WHEEL, 
      payload: { newScale: nextScale, newOffset } 
    });
    
  } else {
      dispatchBoardState({
        type: TOOL_ACTIONS.SET_OFFSET,
        payload: { x: -e.deltaX, y: -e.deltaY }
      });
    }
  };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [dispatchBoardState]);


const zoomStep = 0.1;

const handleZoomIn = () => {
  dispatchBoardState({ type: TOOL_ACTIONS.SET_SCALE, payload: scale + zoomStep });
};

const handleZoomOut = () => {
  dispatchBoardState({ type: TOOL_ACTIONS.SET_SCALE, payload: scale - zoomStep });
};

const handleResetZoom = () => {
  dispatchBoardState({ type: TOOL_ACTIONS.SET_SCALE, payload: 1 });
};

const handleTextChange = (e) => {
  const textarea = e.target;
  textarea.style.width = 'auto';
  textarea.style.width = `${textarea.scrollWidth}px`;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

  return (
    <div className={classes.boardWrapper}>  
        <Toolbar currTool={currTool} />
        <Toolbox />
        {currState == CURR_STATE.WRITING && <textarea onInput={handleTextChange} ref={textAreaRef} className={classes.textArea} style={{position : "absolute",top:elements[elements.length-1].y1 * scale + offset.y, left: elements[elements.length-1].x1 * scale + offset.x, fontSize: `${state[currTool].strokeWidth*scale}px`, color : state[currTool].stroke}} onBlur={(e) => handleTextAreaBlur(e.target.value)}/>}

        <Scale handleZoomOut={handleZoomOut} handleResetZoom={handleResetZoom} handleZoomIn={handleZoomIn} scale={scale} />
        <div className={classes.gridBackground} />
        <canvas 
          id='canvas' 
          ref={canvasRef} 
          height={window.innerHeight} 
          width={window.innerWidth} 
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove} 
          onPointerUp={handleMouseUp} 
          style={{ 
            touchAction: "none", 
            userSelect: "none",
            backgroundColor: "#121212",
             
          }}
        />
        <History />
      
        <Coordinates currPos={currPos} offset={offset} handleSetOffset={handleSetOffset} scale={scale}/>
    </div>
  )
}

export default Board
