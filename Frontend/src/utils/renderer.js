import rough from "roughjs/bin/rough";
import { TOOLS } from "../constants.js";
import { getArrowHeadCoordinates, getSvgPathFromStroke } from "./math.js";
import getStroke from "perfect-freehand";

const generator = rough.generator();

export const renderElement = (element, roughCanvas, context) => {
  if (!element._cache) element._cache = {};

  switch (element.type) {
    case TOOLS.LINE: {
      if (!element._cache.drawable) {
        element._cache.drawable = generator.line(
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.options
        );
      }
      roughCanvas.draw(element._cache.drawable);
      break;
    }

    case TOOLS.RECT: {
      if (!element._cache.drawable) {
        element._cache.drawable = generator.rectangle(
          element.x1,
          element.y1,
          element.x2 - element.x1,
          element.y2 - element.y1,
          element.options
        );
      }
      roughCanvas.draw(element._cache.drawable);
      break;
    }

    case TOOLS.CIRCLE: {
      if (!element._cache.drawable) {
        element._cache.drawable = generator.ellipse(
          (element.x1 + element.x2) / 2,
          (element.y1 + element.y2) / 2,
          Math.abs(element.x2 - element.x1),
          Math.abs(element.y2 - element.y1),
          element.options
        );
      }
      roughCanvas.draw(element._cache.drawable);
      break;
    }

    case TOOLS.ARROW: {
      if (!element._cache.drawable) {
        const { headX1, headY1, headX2, headY2 } =
          getArrowHeadCoordinates(
            element.x1,
            element.y1,
            element.x2,
            element.y2
          );

        element._cache.drawable = generator.linearPath(
          [
            [element.x1, element.y1],
            [element.x2, element.y2],
            [headX1, headY1],
            [element.x2, element.y2],
            [headX2, headY2],
          ],
          element.options
        );
      }

      roughCanvas.draw(element._cache.drawable);
      break;
    }

    case TOOLS.BRUSH: {
      if (!element.path) {
        const points = element.points || [];
        element.path = new Path2D(
          getSvgPathFromStroke(
            getStroke(points, {
              size: element.options.strokeWidth * 4,
            })
          )
        );
      }
      context.save();
      context.fillStyle = element.options.stroke;
      context.fill(element.path);
      context.restore();
      break;
    }

    case TOOLS.TEXT: {
      context.save();
      context.textBaseline = "top";
      context.font = `${element.options.strokeWidth}px Caveat`;
      context.fillStyle = element.options.stroke;

      const lines = element.text.split("\n");
      lines.forEach((line, i) => {
        context.fillText(
          line,
          element.x1,
          element.y1 + i * element.options.strokeWidth
        );
      });

      context.restore();
      break;
    }
  }
};