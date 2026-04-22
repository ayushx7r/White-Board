import {useRef, useEffect, useLayoutEffect, useContext} from 'react'
import Toolbar from '../Toolbar/Toolbar.jsx'
import BoardContext from '../../store/BoardContext'; 
import rough from 'roughjs/bin/rough'
import Toolbox from '../Toolbox/Toolbox';

const Board = () => {
    const canvasRef = useRef();
    const { currTool, elements, handleMouseDown, handleMouseMove, handleMouseUp } = useContext(BoardContext);
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      let roughCanvas = rough.canvas(canvas);
      elements.forEach(element => {
        roughCanvas.draw(element.drawable);
      })
      
      return () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    },[elements]);

  return (
    <>  
        <Toolbar currTool={currTool} />
        <Toolbox />
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
    </>
  )
}

export default Board
