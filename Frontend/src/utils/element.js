import rough from "roughjs";
import { getArrowHeadCoordinates, getSvgPathFromStroke } from "./math";
import { TOOLS } from "../constants";
import { getStroke } from "perfect-freehand";

const generator = rough.generator();

export const createElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  type,
  options = {}   // ✅ FIX 1: default empty object
) => {
  const cleanOptions = {
    seed: id + 1,
    strokeWidth: options?.strokeWidth ?? 2,
    stroke: options?.stroke ?? "#fff",
    fill: options?.fill ?? "transparent",
  };

  const base = {
    id,
    type,
    x1,
    y1,
    x2,
    y2,
    options: cleanOptions,
  };

  switch (type) {
    case TOOLS.LINE: {
      return {
        ...base,
        drawable: generator.line(x1, y1, x2, y2, cleanOptions),
      };
    }

    case TOOLS.RECT: {
      return {
        ...base,
        drawable: generator.rectangle(
          x1,
          y1,
          x2 - x1,
          y2 - y1,
          cleanOptions
        ),
      };
    }

    case TOOLS.CIRCLE: {
      return {
        ...base,
        drawable: generator.ellipse(
          (x1 + x2) / 2,
          (y1 + y2) / 2,
          Math.abs(x2 - x1),
          Math.abs(y2 - y1),
          cleanOptions
        ),
      };
    }

    case TOOLS.ARROW: {
      const {
        headX1,
        headY1,
        headX2,
        headY2,
      } = getArrowHeadCoordinates(x1, y1, x2, y2);

      return {
        ...base,
        drawable: generator.linearPath(
          [
            [x1, y1],
            [x2, y2],
            [headX1, headY1],
            [x2, y2],
            [headX2, headY2],
          ],
          cleanOptions
        ),
      };
    }

    case TOOLS.BRUSH: {
      const points = [{ x: x1, y: y1 }];

      return {
        ...base,
        points,
        path: new Path2D(
          getSvgPathFromStroke(
            getStroke(points, {
              size: cleanOptions.strokeWidth * 4,
            })
          )
        ),
      };
    }

    case TOOLS.TEXT: {
      return {
        ...base,
        text: "",
      };
    }

    default:
      throw new Error("Type Not Recognized");
  }
};