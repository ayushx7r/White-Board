import { TOOLS } from "../constants";

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

export const hasStroke = (element) => {
  return (element != "ERASER");
}

const average = (a, b) => (a + b) / 2

export function getSvgPathFromStroke(points, closed = true) {
  const len = points.length

  if (len < 4) {
    return ``
  }

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `
  }

  if (closed) {
    result += 'Z'
  }

  return result
}


const getDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

const distanceToSegment = (p, v, w) => {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return getDistance(p, v);
    
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t)); 
    
    const projection = {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    };
    
    return getDistance(p, projection);
};

export const checkSegmentsHit = (element, x, y, threshold) => {
    const p = { x, y };
    const { x1, y1, x2, y2, type, drawable } = element;
    switch (type) {
        case TOOLS.LINE:
            return distanceToSegment(p, { x: x1, y: y1 }, { x: x2, y: y2 }) < threshold;

        case TOOLS.RECT: {
            const topLeft = { x: x1, y: y1 };
            const topRight = { x: x2, y: y1 };
            const bottomLeft = { x: x1, y: y2 };
            const bottomRight = { x: x2, y: y2 };
            if (drawable.options.fill && drawable.options.fill !== 'none' && drawable.options.fill !== 'transparent') {
                const isInside = x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && 
                                y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
                
                if (isInside) return true;
            }

            const sides = [
                [topLeft, topRight],
                [topRight, bottomRight],
                [bottomRight, bottomLeft],
                [bottomLeft, topLeft]
            ];

            return sides.some(([v, w]) => distanceToSegment(p, v, w) < threshold);
        }

        case TOOLS.ARROW: {
            // main shaft
            const shaftHit = distanceToSegment(p, { x: x1, y: y1 }, { x: x2, y: y2 }) < threshold;
            if (shaftHit) return true;

            // arrowhead wings
            const { headX1, headY1, headX2, headY2 } = getArrowHeadCoordinates(x1, y1, x2, y2);
            const wing1 = distanceToSegment(p, { x: x2, y: y2 }, { x: headX1, y: headY1 }) < threshold;
            const wing2 = distanceToSegment(p, { x: x2, y: y2 }, { x: headX2, y: headY2 }) < threshold;

            return wing1 || wing2;
        }
        case TOOLS.BRUSH: {
            return element.points.some((point, i) => {
                if(i == 0) {
                  const distanceToPoint = getDistance(p, point);
                  return (distanceToPoint < threshold);
                }
                const prev = element.points[i - 1];
                return distanceToSegment(p, prev, point) < threshold;
            });
        }
        case TOOLS.CIRCLE: {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;

            // Single Point
            if (rx === 0 && ry === 0) {
                return getDistance(p, { x: cx, y: cy }) < threshold;
            }

            const dx = p.x - cx;
            const dy = p.y - cy;
            
            // 2. Normalized distance from center
            const distanceRatio = Math.sqrt(
                (dx / (rx || 1)) ** 2 + 
                (dy / (ry || 1)) ** 2
            );

            // HIT Zone
            const tolerance = threshold / Math.max(rx, ry);
            return Math.abs(distanceRatio - 1) < tolerance;
        }

        default:
            return false;
    }
};