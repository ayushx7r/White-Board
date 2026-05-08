import React, { useMemo } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import classes from "./CustomPicker.module.css";

extend([namesPlugin]);

const CustomPicker = ({ color, ...rest }) => {
  const rgbaString = useMemo(() => {
    return color.startsWith("rgba") ? color : colord(color).toRgbString();
  }, [color]);

  return (
    <div className={classes.pickerContainer}>
      <RgbaStringColorPicker 
        color={rgbaString} 
        {...rest} 
        className={classes.customColorful}
      />
      <div className={classes.colorValues}>
        <div 
          className={classes.swatch} 
          style={{ backgroundColor: rgbaString }} 
        />
        <span className={classes.hexText}>
          {colord(rgbaString).toHex().toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default CustomPicker;