export const TOOLS = {
    BRUSH : "BRUSH",
    LINE : "LINE",
    RECT : "RECT",
    CIRCLE : "CIRCLE",
    ARROW : "ARROW",
    ERASER : "ERASER",
    TEXT : "TEXT",
    MOVE : "MOVE"
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
    DELETE_LAST : "DELETE_LAST",
    SET_OFFSET : "SET_OFFSET"
}

export const CURR_STATE = {
    IDLE : "idle",
    DRAWING : "drawing",
    ERASING : "erasing",
    WRITING : "writing",
    PANNING : "panning"
}

export const COLORS = {
    BLACK : "#000",
    YELLOW : "#ff0",
    RED : "#f00",
    TRANS : "#fff",
    BLUE : "#155DFC",
    PURPLE : "#800080"
}