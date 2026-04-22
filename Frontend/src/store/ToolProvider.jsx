import { useContext, useReducer, useState } from "react";
import ToolContext from "./ToolContext";
import { TOOLS } from "../constants";
import BoardContext from "./BoardContext";

const toolReducer = (state, action) => {
    switch(action.type) {
        case "CHANGE_COLOR": {
            return {...state, ...action.payload};
        }
        case "CHANGE_STROKE_WIDTTH": {
            return {...state, ...action.payload}
        }
    }
}

// const initialState = {
//     [TOOLS.LINE] : {
//         stroke : "black",
//         strokeWidth : 1
//     },
//     [TOOLS.RECT] : {
//         stroke : "black",
//         fill : "transparent",
//         strokeWidth : 1
//     },
//     [TOOLS.CIRCLE] : {
//         stroke : "black",
//         fill : "transparent",
//         strokeWidth : 1
//     },
//     [TOOLS.ARROW] : {
//         stroke : "black",
//         strokeWidth : 1
//     }
// }

const initialState = {
    stroke : "#000",
    strokeWidth : "1",
    fill : "transparent"
}
  

const ToolProvider = ({children}) => {
    const [state, dispatchToolAction] = useReducer(toolReducer, initialState);
    const handleStrokeColorChange = (color, tool) => {
        dispatchToolAction({type : "CHANGE_COLOR", payload : {stroke : color}});
    }

    const handleFillShape = (color, tool) => {
        dispatchToolAction({type : "CHANGE_COLOR", payload : {fill : color}});
    }

    const handleStrokeWidthChange = (width) => {
        dispatchToolAction({type : "CHANGE_STROKE_WIDTTH", payload : { strokeWidth : width}})
    }

    const data = {state, handleStrokeColorChange, handleFillShape, handleStrokeWidthChange};

    return (
        <ToolContext.Provider value={data}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolProvider;
