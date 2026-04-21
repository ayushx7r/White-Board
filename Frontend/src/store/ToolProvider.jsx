import { useReducer, useState } from "react";
import ToolContext from "./ToolContext";
import { TOOLS } from "../constants";

const toolReducer = (state, action) => {

}

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
  

const ToolProvider = ({children}) => {
    const [state, dispachToolState] = useReducer(toolReducer, initialState)

    return (
        <ToolContext.Provider value={state}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolProvider;
