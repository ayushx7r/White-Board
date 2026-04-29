export const TOOLS = {
    BRUSH : "BRUSH",
    LINE : "LINE",
    RECT : "RECT",
    CIRCLE : "CIRCLE",
    ARROW : "ARROW",
    ERASER : "ERASER",
    TEXT : "TEXT",
}

export const TOOL_ACTIONS = {
    SET_CURR_TOOL : "SET_CURR_TOOL",
    SET_CURR_POS : "SET_CURR_POS",
    SET_CURR_STATE : "SET_CURR_STATE",
    ADD_ELEMENT : "ADD_ELEMENT",
    DRAW_MOVE : "DRAW_MOVE",
    ERASE_MOVE: "ERASE_MOVE",
    TEXT_WRITE : "TEXT_WRITE",
    SNAPSHOT : "SNAPSHOT",
    UNDO : "UNDO",
    REDO : "REDO",
    SET_OFFSET : "SET_OFFSET",
    SET_SCALE : "SET_SCALE",
    ZOOM_WHEEL : "ZOOM_WHEEL",
    DELETE_CURR_HISTORY : "DELETE_CURR_HISTORY"
}

export const CURR_STATE = {
    IDLE : "idle",
    DRAWING : "drawing",
    ERASING : "erasing",
    WRITING : "writing",
}

export const COLORS = {
    BLACK : "#000",
    YELLOW : "#ff0",
    RED : "#f00",
    TRANS : "#fff",
    BLUE : "#155DFC",
    PURPLE : "#800080"
}