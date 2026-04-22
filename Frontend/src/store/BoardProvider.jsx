import { createContext, useContext, useReducer } from 'react'
import rough from "roughjs/bin/rough"
import { createElement } from '../utils/element';
import BoardContext from './BoardContext';
import { CURR_STATE, TOOL_ACTIONS, TOOLS } from '../constants';
import ToolContext from './ToolContext.js'


const initialBoardState = {
    currTool : TOOLS.LINE,
    elements : [],
    handleMouseDown : () => {},
    handleMouseMove : () => {},
    handleMouseUp : () => {},
    currState : CURR_STATE.IDLE,
    options : {}
}

const generator = rough.generator();

function boardReducer (state, action) {
  switch(action.type) {
    case TOOL_ACTIONS.SET_CURR_TOOL: {
      return {...state, currTool : action.payload};
    }
    case TOOL_ACTIONS.SET_CURR_STATE: {
      return {...state, currState : action.payload};
    }
    case TOOL_ACTIONS.ADD_ELEMENT : {
      const element = createElement(state.elements.length+1, action.payload.points.x1, action.payload.points.y1, action.payload.points.x2, action.payload.points.y2, state.currTool, action.options);
      return {...state, elements : [...state.elements, element]};
    }
    case TOOL_ACTIONS.DRAW_MOVE: {
      const newElements = [...state.elements];
      const index = newElements.length-1;
      const x1 = newElements[index].x1;
      const y1 = state.elements[index].y1;
      const options = state.elements[index].drawable.options;
      const newElement = createElement(index, x1, y1, action.payload.x, action.payload.y, state.currTool, options);
      newElements[index] = newElement;
      return {...state, elements : [...newElements]};
    }
    default : return state;
  }
}

const BoardProvider = ({children}) => {
   
    const [boardState, dispatchBoardState] = useReducer(boardReducer, initialBoardState);
    const ctx = useContext(ToolContext);
    const handleMouseDown = (e) => {
      dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.DRAWING});
      const {clientX, clientY} = e;
      dispatchBoardState({type : TOOL_ACTIONS.ADD_ELEMENT, payload : {points : {x1 : clientX, y1 : clientY, x2 : clientX, y2 : clientY}}, options : ctx.state});
    }

    const handleMouseMove = (e) => {
      const {clientX, clientY} = e;
      if(boardState.currState == CURR_STATE.DRAWING) {
        dispatchBoardState({type : TOOL_ACTIONS.DRAW_MOVE, payload : {x : clientX, y : clientY}});
      }
    }

    const handleMouseUp = () => {
      if(boardState.currState == CURR_STATE.DRAWING) {
        dispatchBoardState({type : TOOL_ACTIONS.SET_CURR_STATE, payload : CURR_STATE.IDLE});
      }
    }

    const handleToolChange = (tool) => {
      dispatchBoardState({type: TOOL_ACTIONS.SET_CURR_TOOL, payload: tool});
    }
    const data = {...boardState, handleMouseDown, handleToolChange, handleMouseMove, handleMouseUp};
  return (
    <BoardContext.Provider value={data}>
      {children}
    </BoardContext.Provider>
  )
}

export default BoardProvider
