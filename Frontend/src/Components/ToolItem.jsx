import React from 'react'
import classes from './Toolbar.module.css'
const ToolItem = ({children, onClick, className}) => {
  return (
    <div className={`${classes.toolItem} ${className}`} onClick={onClick}>
      <p>{children}</p>
    </div>
  )
}

export default ToolItem
