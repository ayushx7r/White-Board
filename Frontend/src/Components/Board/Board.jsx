import {useRef, useLayoutEffect, useContext} from 'react'
import Toolbar from '../Toolbar'
import BoardContext from '../../store/BoardContext'; 
import rough from 'roughjs/bin/rough'

const Board = () => {
    const canvasRef = useRef();
    const { currTool, elements, handleMouseDown, handleMouseMove, handleMouseUp } = useContext(BoardContext);
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      let roughCanvas = rough.canvas(canvas);
      elements.forEach(element => {
        roughCanvas.draw(element.drawable);
      })

      return () => {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    },[elements]);

  return (
    <>  
        <Toolbar currTool={currTool} />
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
    </>
  )
}

export default Board
