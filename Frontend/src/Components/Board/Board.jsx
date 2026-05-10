import {
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
} from "react";

import { renderElement } from "../../utils/renderer.js";

import Toolbar from "../Toolbar/Toolbar.jsx";
import BoardContext from "../../store/BoardContext";
import rough from "roughjs/bin/rough";
import Toolbox from "../Toolbox/Toolbox";
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from "../../constants.js";
import ToolContext from "../../store/ToolContext.js";
import classes from "./Board.module.css";
import History from "../History/History.jsx";
import Scale from "../Scale/Scale.jsx";
import Coordinates from "../Coordinate/Coordinate.jsx";

import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);
  const roughCanvasRef = useRef(null);

  const {
    currTool,
    currPos,
    currState,
    elements,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTextAreaBlur,
    offset,
    scale,
    dispatchBoardState,
    handleSetOffset,
  } = useContext(BoardContext);

  const { state } = useContext(ToolContext);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        roughCanvasRef.current = rough.canvas(canvas);

        dispatchBoardState({
          type: "__FORCE_REDRAW__",
        });
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatchBoardState]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    context.translate(offset.x, offset.y);

    context.scale(scale, scale);

    if (!roughCanvasRef.current) {
      roughCanvasRef.current = rough.canvas(canvas);
    }

    const roughCanvas = roughCanvasRef.current;

    elements.forEach((element) => {
      renderElement(element, roughCanvas, context);
    });

    if (currState === CURR_STATE.ERASING) {
      const { x, y } = currPos;

      context.save();

      context.beginPath();

      context.arc(x, y, 16, 0, Math.PI * 2);

      context.fillStyle = "rgba(255,255,255,0.1)";

      context.fill();

      context.setLineDash([5, 5]);

      context.strokeStyle = "#999";

      context.stroke();

      context.restore();
    }

    context.restore();
  }, [
    elements,
    currPos,
    currState,
    offset,
    scale,
  ]);

  useEffect(() => {
    if (
      currState === CURR_STATE.WRITING &&
      textAreaRef.current
    ) {
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

    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const currentScale = scaleRef.current;
      const currentOffset = offsetRef.current;

      if (e.ctrlKey) {
        const zoomSensitivity = 0.005;

        const delta = -e.deltaY * zoomSensitivity;

        const rawNextScale = currentScale + delta;

        const nextScale = Math.min(
          Math.max(rawNextScale, 0.1),
          5
        );

        if (nextScale === currentScale) return;

        const mouseWorldX =
          (e.clientX - currentOffset.x) / currentScale;

        const mouseWorldY =
          (e.clientY - currentOffset.y) / currentScale;

        const newOffset = {
          x: Math.round(
            e.clientX - mouseWorldX * nextScale
          ),
          y: Math.round(
            e.clientY - mouseWorldY * nextScale
          ),
        };

        dispatchBoardState({
          type: TOOL_ACTIONS.ZOOM_WHEEL,
          payload: {
            newScale: nextScale,
            newOffset,
          },
        });
      } else {
        dispatchBoardState({
          type: TOOL_ACTIONS.SET_OFFSET,
          payload: {
            x: -e.deltaX,
            y: -e.deltaY,
          },
        });
      }
    };

    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [dispatchBoardState]);

  const zoomStep = 0.1;

  const handleZoomIn = () => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_SCALE,
      payload: scale + zoomStep,
    });
  };

  const handleZoomOut = () => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_SCALE,
      payload: scale - zoomStep,
    });
  };

  const handleResetZoom = () => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_SCALE,
      payload: 1,
    });
  };

  const handleTextChange = (e) => {
    const textarea = e.target;

    textarea.style.width = "auto";
    textarea.style.width = `${textarea.scrollWidth}px`;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={classes.boardWrapper}>
      <button
        className={classes.backBtn}
        onClick={() => navigate("/")}
      >
        <FiArrowLeft />
      </button>

      <Toolbar currTool={currTool} />

      <Toolbox />

      {currState === CURR_STATE.WRITING && (
        <textarea
          ref={textAreaRef}
          onInput={handleTextChange}
          className={classes.textArea}
          style={{
            position: "absolute",

            top:
              elements[elements.length - 1].y1 *
                scale +
              offset.y,

            left:
              elements[elements.length - 1].x1 *
                scale +
              offset.x,

            fontSize: `${
              state[currTool].strokeWidth * scale
            }px`,

            color: state[currTool].stroke,
          }}
          onBlur={(e) =>
            handleTextAreaBlur(e.target.value)
          }
        />
      )}

      <Scale
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
        handleZoomIn={handleZoomIn}
        scale={scale}
      />

      <div className={classes.gridBackground} />

      <canvas
        id="canvas"
        ref={canvasRef}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerCancel={handleMouseUp}
        style={{
          touchAction: "none",
          userSelect: "none",
          backgroundColor: "#121212",
        }}
      />

      <History />

      <Coordinates
        currPos={currPos}
        offset={offset}
        handleSetOffset={handleSetOffset}
        scale={scale}
      />
    </div>
  );
};

export default Board;