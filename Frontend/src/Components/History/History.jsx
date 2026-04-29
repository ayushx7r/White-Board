import React from 'react'
import classes from './History.module.css'
import { IoIosUndo, IoIosRedo } from "react-icons/io";
import BoardContext from "../../store/BoardContext"
import { useContext } from 'react';
import Board from '../Board/Board';
const History = () => {
    const {history, index, handleUndoButtonClick, handleRedoButtonClick} = useContext(BoardContext);
  return (
    <div className={classes.container}>
      <button className={index == 0 ? classes.disabled : ''}  onClick={handleUndoButtonClick}><IoIosUndo/></button>
      <button className={index == history.length - 1 ? classes.disabled : ''} onClick={handleRedoButtonClick}><IoIosRedo/></button>
    </div>
  )
}

export default History
