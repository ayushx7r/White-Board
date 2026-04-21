import {createContext, useContext} from 'react'
import { TOOLS, CURR_STATE } from '../constants';

const initialState = {
    currTool : TOOLS.LINE,
    elements : [],
    handleMouseDown : () => {},
    handleMouseMove : () => {},
    handleMouseUp : () => {},
    currState : CURR_STATE.IDLE,
    options : {}
}

const BoardContext = createContext(initialState);

export default BoardContext;