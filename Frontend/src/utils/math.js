const getLineLength = (x1, y1, x2, y2) => {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

const getHeadLength = (x1, y1, x2, y2) => {
    const length = getLineLength(x1, y1, x2, y2);
    return Math.min(20, length/3);

}

export const getArrowHeadCoordinates = (x1, y1, x2, y2) => {
    const headLength = getHeadLength(x1, y1, x2, y2);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headX1 = x2 - headLength * Math.cos(angle - Math.PI/6);
    const headY1 = y2 - headLength * Math.sin(angle - Math.PI/6);

    const headX2 = x2 - headLength * Math.cos(angle + Math.PI/6);
    const headY2 = y2 - headLength * Math.sin(angle + Math.PI/6);
    return {headX1, headY1, headX2, headY2};
};

export const isClosed = (element) => {
    return (element == "RECT" || element == "CIRCLE");
}