import React, { useState } from 'react';
import classes from './CreateCanvas.module.css';
import { FiX, FiFileText, FiImage, FiGlobe, FiLock } from "react-icons/fi";

const CreateCanvasModal = ({ onClose }) => {
  const [visibility, setVisibility] = useState('private');

  return (
    <div className={classes.backdrop} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <header className={classes.header}>
          <h3>New Canvas</h3>
          <button className={classes.closeBtn} onClick={onClose}><FiX /></button>
        </header>

        <form className={classes.form}>
          <div className={classes.inputWrapper}>
            <label>Canvas Title</label>
            <div className={classes.inputField}>
              <FiFileText className={classes.icon} />
              <input type="text" placeholder="e.g. Brainstorming Project X" autoFocus />
            </div>
          </div>

          <div className={classes.inputWrapper}>
            <label>Visibility</label>
            <div className={classes.visibilityOptions}>
              <div 
                className={`${classes.option} ${visibility === 'private' ? classes.activeOption : ''}`}
                onClick={() => setVisibility('private')}
              >
                <FiLock />
                <div>
                  <p>Private</p>
                  <span>Only you can see this</span>
                </div>
              </div>
              
              <div 
                className={`${classes.option} ${visibility === 'public' ? classes.activeOption : ''}`}
                onClick={() => setVisibility('public')}
              >
                <FiGlobe />
                <div>
                  <p>Public</p>
                  <span>Anyone with link can view</span>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.footer}>
            <button type="button" className={classes.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={classes.submitBtn}>Create Canvas</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCanvasModal;