import { createContext, useContext, useReducer } from 'react'
import rough from "roughjs/bin/rough"
import { createElement } from '../utils/element';
import BoardContext from './BoardContext';
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from '../constants';
import ToolContext from './ToolContext.js'
import { checkSegmentsHit, getSvgPathFromStroke } from '../utils/math.js';
import getStroke from 'perfect-freehand';


const initialBoardState = {
    currTool : TOOLS.BRUSH,
    elements : [],
    handleMouseDown : () => {},
    handleMouseMove : () => {},
    handleMouseUp : () => {},
    currState : CURR_STATE.IDLE,
    options : {},
    currPos : {x : 0, y : 0},
    history : [[]],
    index : 0,
    offset : {x : 0, y : 0},
    scale : 1
}

const generator = rough.generator();

function boardReducer (state, action) {
  switch(action.type) {
    case TOOL_ACTIONS.SET_CURR_TOOL: {
      return {...state, currTool : action.payload};
    }
    case TOOL_ACTIONS.SET_CURR_POS: {
      return {...state, currPos : {x : action.payload.x, y : action.payload.y}};
    }
    case TOOL_ACTIONS.SET_CURR_STATE: {
      return {...state, currState : action.payload};
    }
    case TOOL_ACTIONS.ADD_ELEMENT : {
      const element = createElement(state.elements.length+1, action.payload.points.x1, action.payload.points.y1, action.payload.points.x2, action.payload.points.y2, state.currTool, action.options);
      return {...state, elements : [...state.elements, element]};
    }
    case TOOL_ACTIONS.SET_OFFSET : {
      return {
        ...state,
        offset : {x : state.offset.x + action.payload.x, y : state.offset.y + action.payload.y}
      }
    }
    case TOOL_ACTIONS.SNAPSHOT : {
      const newHistory = state.history.slice(0, state.index+1);
      newHistory.push(state.elements);
      return {
        ...state,
        history : newHistory,
        index : state.index+1
      }
    }
    case TOOL_ACTIONS.DELETE_LAST : {
      const newElements = state.elements.slice(0, state.elements.length);
      newElements.pop();
      return {
        ...state, elements : newElements
      }
    }

    case TOOL_ACTIONS.UNDO : {
      if(state.index <= 0) return state;
      return {
        ...state,
        elements : state.history[state.index-1],
        index : state.index - 1
      }
    }
    case TOOL_ACTIONS.REDO : {
      if(state.index >= state.history.length-1) return state;

      return {
        ...state,
        elements : state.history[state.index+1],
        index : state.index + 1
      }
    }
    case TOOL_ACTIONS.TEXT_WRITE : {
      const newElements = [...state.elements];
      const index = newElements.length - 1;
      newElements[index].text = action.payload;

      return {...state, elements : [...newElements]};
    }
    case TOOL_ACTIONS.DRAW_MOVE: {
      let newElements = [...state.elements];
      const index = newElements.length-1;
      switch(state.currTool) {
        case TOOLS.BRUSH : {
          newElements[index].points = [...newElements[index].points, {x : action.payload.x, y : action.payload.y}];
          newElements[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points, {size : newElements[index].options.strokeWidth*3})));

          return {...state, elements : [...newElements]};
        }
        case TOOLS.CIRCLE :
        case TOOLS.LINE :
        case TOOLS.RECT :
        case TOOLS.ARROW : {
          const x1 = newElements[index].x1;
          const y1 = state.elements[index].y1;
          const options = state.elements[index].drawable.options;
          const newElement = createElement(index, x1, y1, action.payload.x, action.payload.y, state.currTool, options);
          newElements[index] = newElement;
          return {...state, elements : [...newElements]};
        }
        case TOOLS.ERASER : {
          newElements = newElements.filter((el) => !checkSegmentsHit(el, action.payload.x, action.payload.y, action.radius*3));
          return {...state, elements : [...newElements]};

        }
        default : {
          throw new Error("Type Not Recogized");
        }
      }
      
    }
    default : return state;
  }
}

const BoardProvider = ({children}) => {
   
    const [boardState, dispatchBoardState] = useReducer(boardReducer, initialBoardState);
    const ctx = useContext(ToolContext);

    const getWorldPointer = (screenX, screenY) => {
      return {
        x: (screenX - boardState.offset.x) / boardState.scale,
        y: (screenY - boardState.offset.y) / boardState.scale
      };
    }; 

    const handleMouseDown = (e) => {
      if(boardState.currState == CURR_STATE.WRITING) {
        dispatchBoardState({type : TOOL_ACTIONS.SNAPSHOT});
        return;
      } 
      const {clientX, clientY} = e;
      const {x, y} = getWorldPointer(clientX, clientY);
      switch(boardState.currTool) {
        case TOOLS.ERASER : {
          dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.ERASING});
          dispatchBoardState({type : TOOL_ACTIONS.DRAW_MOVE, payload : {x : x, y : y}});
          break;
        }
        case TOOLS.TEXT : {
          dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.WRITING});
          dispatchBoardState({type : TOOL_ACTIONS.ADD_ELEMENT, payload : {points : {x1 : x, y1 : y, x2 : x, y2 : y}}, options : ctx.state[boardState.currTool]});
          break;
        }
        case TOOLS.ARROW:
        case TOOLS.BRUSH:
        case TOOLS.CIRCLE:
        case TOOLS.LINE:
        case TOOLS.RECT: {
          dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.DRAWING});
          dispatchBoardState({type : TOOL_ACTIONS.ADD_ELEMENT, payload : {points : {x1 : x, y1 : y, x2 : x, y2 : y}}, options : ctx.state[boardState.currTool]});
          break;
        }
        case TOOLS.MOVE : {
          dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.PANNING});
          break;
        }
      }
    }

    const handleMouseMove = (e) => {
      if(boardState.currState == CURR_STATE.WRITING) return;
      const {clientX, clientY} = e;
      const {x, y} = getWorldPointer(clientX, clientY);
      dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_POS, payload : {x : x, y : y}});
      if(boardState.currState == CURR_STATE.DRAWING || boardState.currState == CURR_STATE.ERASING) {
        dispatchBoardState({type : TOOL_ACTIONS.DRAW_MOVE, payload : {x : x, y : y}, radius : ctx.state[boardState.currTool].strokeWidth});
      } 
      if(boardState.currState == CURR_STATE.PANNING) {
        dispatchBoardState({type : TOOL_ACTIONS.SET_OFFSET, payload : {x : e.movementX, y : e.movementY}});
      }
    }

    const handleMouseUp = () => {
      if(boardState.currTool == TOOLS.TEXT) return;
      if(boardState.currTool != TOOLS.MOVE) dispatchBoardState({type : TOOL_ACTIONS.SNAPSHOT});
      if(boardState.currState != CURR_STATE.IDLE) {
        dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.IDLE});
      }
    }

    const handleToolChange = (tool) => {
      dispatchBoardState({type: TOOL_ACTIONS.SET_CURR_TOOL, payload: tool});
    }

    const handleTextAreaBlur = (text) => {
      dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.IDLE});
      dispatchBoardState({type : TOOL_ACTIONS.TEXT_WRITE, payload : text});
    }

    const handleUndoButtonClick = () => {
      dispatchBoardState({type : TOOL_ACTIONS.UNDO});
    } 
    
    const handleRedoButtonClick = () => {
      dispatchBoardState({type : TOOL_ACTIONS.REDO});
    }

    const handleCanvasScroll = (e) => {
      dispatchBoardState({type : TOOL_ACTIONS.SET_OFFSET, payload : {x : e.movementX, y : e.movementY}});
    }


    const data = {...boardState, handleMouseDown, handleToolChange, handleMouseMove, handleMouseUp, handleTextAreaBlur, handleUndoButtonClick, handleRedoButtonClick, handleCanvasScroll};
  return (
    <BoardContext.Provider value={data}>
      {children}
    </BoardContext.Provider>
  )
}

export default BoardProvider
