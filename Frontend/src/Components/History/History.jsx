import React, { useEffect } from 'react'
import classes from './History.module.css'
import { IoIosUndo, IoIosRedo } from "react-icons/io";
import BoardContext from "../../store/BoardContext"
import { useContext } from 'react';
import Board from '../Board/Board';
import { CURR_STATE } from '../../constants';
const History = () => {
    const {currState, history, index, handleUndoButtonClick, handleRedoButtonClick} = useContext(BoardContext);
    useEffect(() => {
      const handleKeyDown = (e) => {
        if(currState == CURR_STATE.IDLE && e.ctrlKey && e.key.toLowerCase() === "z") {
          if(e.shiftKey) {
            handleRedoButtonClick();
          } else {
            handleUndoButtonClick();
          }
        }
      }
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      }
    }, [handleUndoButtonClick, handleRedoButtonClick]);
  return (
    <div className={classes.container}>
      <button className={index == 0 ? classes.disabled : ''}  onClick={handleUndoButtonClick}><IoIosUndo/></button>
      <button className={index == history.length - 1 ? classes.disabled : ''} onClick={handleRedoButtonClick}><IoIosRedo/></button>
    </div>
  )
}

export default History
