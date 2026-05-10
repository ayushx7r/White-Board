import {
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useEffect
} from "react";
import rough from "roughjs/bin/rough";
import { createElement } from "../utils/element";
import BoardContext from "./BoardContext";
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from "../constants";
import ToolContext from "./ToolContext.js";
import { checkSegmentsHit, getSvgPathFromStroke } from "../utils/math.js";
import getStroke from "perfect-freehand";
import {useParams} from 'react-router-dom'

const initialBoardState = {
  currTool: TOOLS.BRUSH,
  elements: [],
  handleMouseDown: () => {},
  handleMouseMove: () => {},
  handleMouseUp: () => {},
  currState: CURR_STATE.IDLE,
  options: {},
  currPos: { x: 0, y: 0 },
  history: [[]],
  index: 0,
  offset: { x: 0, y: 0 },
  scale: 1,
};

rough.generator();

function boardReducer(state, action) {
  switch (action.type) {
    case TOOL_ACTIONS.SET_CURR_TOOL: {
      return {
        ...state,
        currTool: action.payload,
      };
    }

    case "SET_BOARD_ELEMENTS": {
      const elements = action.payload.elements || [];
      return {
        ...state,
        elements: [...elements],
        history: [
          elements.map((el) => ({
            ...el,
            points: el.points ? [...el.points] : undefined,
          })),
        ],
        index: 0,
      };
    }

    case "__FORCE_REDRAW__": {
      return {
        ...state, elements : [...state.elements]
      };
    }

    case TOOL_ACTIONS.SET_OFFSET: {
      return {
        ...state,
        offset: {
          x: state.offset.x + action.payload.x,
          y: state.offset.y + action.payload.y,
        },
      };
    }

    case TOOL_ACTIONS.RESET_OFFSET: {
      return {
        ...state,
        offset: { x: 0, y: 0 },
        currPos: { x: 0, y: 0 },
      };
    }

    case TOOL_ACTIONS.ZOOM_WHEEL: {
      return {
        ...state,
        scale: Math.min(Math.max(action.payload.newScale, 0.1), 5),
        offset: action.payload.newOffset,
      };
    }

    case TOOL_ACTIONS.SET_SCALE: {
      const newScale = Math.min(Math.max(action.payload, 0.1), 5);

      const anchorX = window.innerWidth / 2;
      const anchorY = window.innerHeight / 2;

      const worldX = (anchorX - state.offset.x) / state.scale;
      const worldY = (anchorY - state.offset.y) / state.scale;

      return {
        ...state,
        scale: newScale,
        offset: {
          x: anchorX - worldX * newScale,
          y: anchorY - worldY * newScale,
        },
      };
    }

    case TOOL_ACTIONS.SET_CURR_POS: {
      return {
        ...state,
        currPos: {
          x: action.payload.x,
          y: action.payload.y,
        },
      };
    }

    case TOOL_ACTIONS.SET_CURR_STATE: {
      return {
        ...state,
        currState: action.payload,
      };
    }

    case TOOL_ACTIONS.ADD_ELEMENT: {
      if (state.currTool === TOOLS.ERASER) return state;

      const element = createElement(
        state.elements.length + 1,
        action.payload.points.x1,
        action.payload.points.y1,
        action.payload.points.x2,
        action.payload.points.y2,
        state.currTool,
        action.options
      );

      return {
        ...state,
        elements: [...state.elements, element],
      };
    }

    case TOOL_ACTIONS.SNAPSHOT: {

      const lastElements = state.history[state.index];

      if (state.elements.length === lastElements.length) {
        return state;
      }

      const newHistory = state.history.slice(0, state.index + 1);

      newHistory.push(
        state.elements.map((el) => ({
          ...el,
          points: el.points ? [...el.points] : undefined,
        }))
      );


      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }

    case TOOL_ACTIONS.UNDO: {
      if (state.index <= 0) return state;

      return {
        ...state,
        elements: state.history[state.index - 1].map((el) => ({
          ...el,
          points: el.points ? [...el.points] : undefined,
        })),
        index: state.index - 1,
      };
    }

    case TOOL_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;

      return {
        ...state,
        elements: state.history[state.index + 1].map((el) => ({
          ...el,
          points: el.points ? [...el.points] : undefined,
        })),
        index: state.index + 1,
      };
    }

    case TOOL_ACTIONS.TEXT_WRITE: {
      const newElements = [...state.elements];

      const index = newElements.length - 1;

      const updatedElement = {
        ...newElements[index],
        text: action.payload,
      };

      newElements[index] = updatedElement;

      return {
        ...state,
        elements: newElements,
      };
    }

    case TOOL_ACTIONS.DRAW_MOVE: {
      let newElements = [...state.elements];

      const index = newElements.length - 1;

      switch (state.currTool) {
        case TOOLS.BRUSH: {
          const currentElement = newElements[index];

          const updatedPoints = [
            ...currentElement.points,
            {
              x: action.payload.x,
              y: action.payload.y,
            },
          ];

          const updatedElement = {
            ...currentElement,
            points: updatedPoints,
            path: new Path2D(
              getSvgPathFromStroke(
                getStroke(updatedPoints, {
                  size: currentElement.options.strokeWidth * 3,
                })
              )
            ),
          };

          newElements[index] = updatedElement;

          return {
            ...state,
            elements: [...newElements],
          };
        }

        case TOOLS.CIRCLE:
        case TOOLS.LINE:
        case TOOLS.RECT:
        case TOOLS.ARROW: {
          const currentElement = newElements[index];

          const newElement = createElement(
            currentElement.id,
            currentElement.x1,
            currentElement.y1,
            action.payload.x,
            action.payload.y,
            state.currTool,
            currentElement.drawable.options
          );

          newElements[index] = newElement;

          return {
            ...state,
            elements: newElements,
          };
        }

        case TOOLS.ERASER: {
          newElements = newElements.filter(
            (el) =>
              !checkSegmentsHit(
                el,
                action.payload.x,
                action.payload.y,
                25
              )
          );

          return {
            ...state,
            elements: newElements,
          };
        }

        default: {
          throw new Error("Type Not Recognized");
        }
      }
    }

    default:
      return state;
  }
}

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    initialBoardState
  );

  const params = useParams();

  const serializeElement = (element) => {
    const { id, type, x1, y1, x2, y2, points, text, options } = element;
    return {
      id,
      type,
      x1,
      y1,
      x2,
      y2,
      points: points ? [...points] : undefined,
      text,
      options: options ? { ...options } : undefined,
    };
  };

  const serializeElements = (elements) =>
    elements.map((element) => serializeElement(element));

const fetchedRef = useRef(false);
const isHydrated = useRef(false);

useEffect(() => {
  if (!params.canvasId) return;

  if (fetchedRef.current) return;   // 🔥 prevent StrictMode double run
  fetchedRef.current = true;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://zenithboard-api.onrender.com/api/canvas/${params.canvasId}`,
        { credentials: "include" }
      );

      const data = await res.json();


      if (!data?.elements) return; 

      const loadedElements = data.elements.map((element) => ({
        ...element,
        options: element.options ? { ...element.options } : {},
      }));

      dispatchBoardState({
        type: "SET_BOARD_ELEMENTS",
        payload: { elements: loadedElements },
      });

      isHydrated.current = true;

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [params.canvasId]);

  const saveCanvas = async () => {
    if (!params.canvasId) return;

    if(!isHydrated.current) return;

    const serializedElements = serializeElements(boardState.elements);
    await fetch(`https://zenithboard-api.onrender.com/api/canvas/${params.canvasId}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({elements : serializedElements}),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const didMount = useRef(false);
  useEffect(() => {
    if(!didMount.current) {
      didMount.current = true;
    }
    saveCanvas();
  }, [boardState.history, boardState.index]);


  const ctx = useContext(ToolContext);

  const lastClickTime = useRef(0);

  const getWorldPointer = useCallback(
    (screenX, screenY) => {
      const rawX = (screenX - boardState.offset.x) / boardState.scale;
      const rawY = (screenY - boardState.offset.y) / boardState.scale;

      return {
        x: Math.round(rawX * 100) / 100,
        y: Math.round(rawY * 100) / 100,
      };
    },
    [boardState.offset, boardState.scale]
  );

  const initiateDrawing = useCallback(
    (e) => {
      const { clientX, clientY, pointerId } = e;

      const { x, y } = getWorldPointer(clientX, clientY);

      if (boardState.currTool === TOOLS.ERASER) {
        dispatchBoardState({
          type: TOOL_ACTIONS.SET_CURR_STATE,
          payload: CURR_STATE.ERASING,
        });
      } else if (boardState.currTool === TOOLS.TEXT) {
        dispatchBoardState({
          type: TOOL_ACTIONS.SET_CURR_STATE,
          payload: CURR_STATE.WRITING,
        });
      } else {
        dispatchBoardState({
          type: TOOL_ACTIONS.SET_CURR_STATE,
          payload: CURR_STATE.DRAWING,
        });
      }

      dispatchBoardState({
        type: TOOL_ACTIONS.ADD_ELEMENT,
        payload: {
          points: {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
          },
        },
        options: ctx.state[boardState.currTool],
      });

      if (e.target) {
        e.target.setPointerCapture(pointerId);
      }
    },
    [boardState.currTool, ctx.state, getWorldPointer]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (e.pointerType === "touch" && !e.isPrimary) return;

      const currentTime = Date.now();

      const timeDiff = currentTime - lastClickTime.current;

      lastClickTime.current = currentTime;

      if (e.pointerType === "touch") {
        if (timeDiff < 300) {
          initiateDrawing(e);
          return;
        }

        return;
      }

      if (e.pointerType === "mouse" && e.button === 0) {
        if (boardState.currState === CURR_STATE.WRITING) {
          dispatchBoardState({
            type: TOOL_ACTIONS.SNAPSHOT,
          });
          return;
        }

        initiateDrawing(e);
      }
    },
    [boardState.currState, initiateDrawing]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (e.pointerType === "touch" && !e.isPrimary) return;

      if (boardState.currState === CURR_STATE.WRITING) return;

      const { clientX, clientY, movementX, movementY } = e;

      const { x, y } = getWorldPointer(clientX, clientY);

      dispatchBoardState({
        type: TOOL_ACTIONS.SET_CURR_POS,
        payload: { x, y },
      });

      if (
        boardState.currState === CURR_STATE.DRAWING ||
        boardState.currState === CURR_STATE.ERASING
      ) {
        dispatchBoardState({
          type: TOOL_ACTIONS.DRAW_MOVE,
          payload: { x, y },
        });
      } else if (boardState.currState === CURR_STATE.IDLE) {
        if (e.buttons === 1 || e.pointerType === "touch") {
          dispatchBoardState({
            type: TOOL_ACTIONS.SET_OFFSET,
            payload: {
              x: movementX,
              y: movementY,
            },
          });
        }
      }
    },
    [boardState.currState, getWorldPointer]
  );

  const handleMouseUp = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.pointerId && e.target?.releasePointerCapture) {
      e.target.releasePointerCapture(e.pointerId);
    }

    if (boardState.currTool === TOOLS.TEXT) return;

    if (boardState.currState !== CURR_STATE.IDLE) {
      dispatchBoardState({
        type: TOOL_ACTIONS.SET_CURR_STATE,
        payload: CURR_STATE.IDLE,
      });
    }

    dispatchBoardState({
      type: TOOL_ACTIONS.SNAPSHOT,
    });
  }, [boardState.currState, boardState.currTool]);

  const handleToolChange = useCallback((tool) => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_CURR_TOOL,
      payload: tool,
    });
  }, []);

  const handleTextAreaBlur = useCallback((text) => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_CURR_STATE,
      payload: CURR_STATE.IDLE,
    });
    console.log("blur");

    dispatchBoardState({
      type: TOOL_ACTIONS.TEXT_WRITE,
      payload: text,
    });

    dispatchBoardState({
      type: TOOL_ACTIONS.SNAPSHOT,
    });
  }, []);

  const handleUndoButtonClick = useCallback(() => {
    dispatchBoardState({
      type: TOOL_ACTIONS.UNDO,
    });
  }, []);

  const handleRedoButtonClick = useCallback(() => {
    dispatchBoardState({
      type: TOOL_ACTIONS.REDO,
    });
  }, []);

  const handleCanvasScroll = useCallback((e) => {
    dispatchBoardState({
      type: TOOL_ACTIONS.SET_OFFSET,
      payload: {
        x: e.movementX,
        y: e.movementY,
      },
    });
  }, []);

  const handleSetOffset = useCallback(() => {
    dispatchBoardState({
      type: TOOL_ACTIONS.RESET_OFFSET,
    });
  }, []);

  const data = useMemo(() => {
    return {
      ...boardState,
      handleMouseDown,
      handleToolChange,
      handleMouseMove,
      handleMouseUp,
      handleTextAreaBlur,
      handleUndoButtonClick,
      handleRedoButtonClick,
      handleCanvasScroll,
      dispatchBoardState,
      handleSetOffset,
    };
  }, [
    boardState,
    handleMouseDown,
    handleToolChange,
    handleMouseMove,
    handleMouseUp,
    handleTextAreaBlur,
    handleUndoButtonClick,
    handleRedoButtonClick,
    handleCanvasScroll,
    handleSetOffset,
  ]);

  return (
    <BoardContext.Provider value={data}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;