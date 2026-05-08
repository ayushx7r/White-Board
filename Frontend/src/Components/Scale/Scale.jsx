import { FiMinus, FiPlus } from "react-icons/fi";
import { MdFilterCenterFocus } from "react-icons/md";

import classes from './Scale.module.css'

const Scale = ({handleZoomIn, handleZoomOut, handleResetZoom, scale}) => {
  return (
    <div className={classes.zoomContainer}>
        <button className={classes.actionBtn} onClick={handleZoomOut} title="Zoom Out">
            <FiMinus />
        </button>
        
        <span className={classes.zoomText} onClick={handleResetZoom} title="Reset Zoom">
            {Math.round(scale * 100)}%
        </span>
        
        <button className={classes.actionBtn} onClick={handleZoomIn} title="Zoom In">
            <FiPlus />
        </button>

        <div className={classes.divider}></div>

        <button className={classes.actionBtn} onClick={handleResetZoom} title="Fit to Screen / Reset">
            <MdFilterCenterFocus />
        </button>
    </div>
  )
}

export default Scale
