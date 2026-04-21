import {createContext} from 'react'
import { TOOLS } from '../constants';

const initialState = {
    [TOOLS.LINE] : {
        stroke : "black",
        strokeWidth : 1
    },
    [TOOLS.RECT] : {
        stroke : "black",
        fill : "transparent",
        strokeWidth : 1
    },
    [TOOLS.CIRCLE] : {
        stroke : "black",
        fill : "transparent",
        strokeWidth : 1
    },
    [TOOLS.ARROW] : {
        stroke : "black",
        strokeWidth : 1
    }
}

const ToolContext = createContext(initialState);

export default ToolContext;