import rough from "roughjs"
import { getArrowHeadCoordinates } from "./math";
import { TOOLS } from "../constants";

const generator = rough.generator();
export const createElement = (id, x1, y1, x2, y2, type, options) => {
    const element = {id, x1, y1, x2, y2};
    const cleanOptions = {
        seed : id+1,
        strokeWidth : options.strokeWidth,
        stroke : options.stroke,
        fill : options.fill
    }
    switch(type) {
        case TOOLS.LINE : {
            element.drawable = generator.line(x1, y1, x2, y2, cleanOptions);
            return element;
        }
        case TOOLS.RECT : {
            element.drawable = generator.rectangle(x1, y1, x2-x1, y2-y1, cleanOptions);
            return element;
        }
        case TOOLS.CIRCLE : {
            element.drawable = generator.ellipse((x1+x2)/2, (y1+y2)/2, Math.abs(x2-x1), Math.abs(y2-y1), cleanOptions);
            return element;
        }
        case TOOLS.ARROW : {
            const {headX1, headY1, headX2, headY2} = getArrowHeadCoordinates(x1, y1, x2, y2);
            element.drawable = generator.linearPath([[x1, y1], [x2, y2], [headX1, headY1], [x2, y2], [headX2, headY2]], cleanOptions);
            return element;
        }
    }
}