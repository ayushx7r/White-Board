import {createContext} from 'react'
import { TOOLS } from '../constants';

const initialState = {
    [TOOLS.LINE] : {
        stroke : "#000",
        strokeWidth : 1
    },
    [TOOLS.RECT] : {
        stroke : "#000",
        fill : "#fff",
        strokeWidth : 1
    },
    [TOOLS.CIRCLE] : {
        stroke : "#000",
        fill : "#fff",
        strokeWidth : 1
    },
    [TOOLS.ARROW] : {
        stroke : "#000",
        strokeWidth : 1
    },
    [TOOLS.BRUSH] : {
        stroke : "#000",
        strokeWidth : 1
    },
    [TOOLS.ERASER] : {
        strokeWidth : 1
    }
}

const ToolContext = createContext(initialState);

export default ToolContext;