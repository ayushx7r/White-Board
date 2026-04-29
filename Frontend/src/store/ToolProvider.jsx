import { useContext, useReducer, useState } from "react";
import ToolContext from "./ToolContext";
import { TOOLS } from "../constants";
import BoardContext from "./BoardContext";

const toolReducer = (state, action) => {
    switch(action.type) {
        case "CHANGE_COLOR": {
            const currTool = action.tool;
            let newState = {...state};
            newState[currTool] = {...newState[currTool], ...action.payload};
            return {...state,  [currTool] : {...newState[currTool]}};
        }
        case "CHANGE_STROKE_WIDTH": {
            const currTool = action.tool;
            let newState = {...state};
            newState[currTool] = {...newState[currTool], ...action.payload};
            return {...state,  [currTool] : {...newState[currTool]}};
        }
    }
}

const initialState = {
    [TOOLS.LINE] : {
        stroke : "#000",
        strokeWidth : 1
    },
    [TOOLS.RECT] : {
        stroke : "#000",
        fill : "#000",
        strokeWidth : 1
    },
    [TOOLS.CIRCLE] : {
        stroke : "#000",
        fill : "#000",
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
    },
    [TOOLS.TEXT] : {
        strokeWidth : 40,
        stroke : "#000"
    }
}
  

const ToolProvider = ({children}) => {
    const [state, dispatchToolAction] = useReducer(toolReducer, initialState);
    const handleStrokeColorChange = (color, tool) => {
        dispatchToolAction({type : "CHANGE_COLOR", payload : {stroke : color}, tool : tool});
    }

    const handleFillShape = (color, tool) => {
        dispatchToolAction({type : "CHANGE_COLOR", payload : {fill : color}, tool : tool});
    }

    const handleStrokeWidthChange = (width, tool) => {
        dispatchToolAction({type : "CHANGE_STROKE_WIDTH", payload : { strokeWidth : width}, tool : tool})
    }

    const data = {state, handleStrokeColorChange, handleFillShape, handleStrokeWidthChange};

    return (
        <ToolContext.Provider value={data}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolProvider;
