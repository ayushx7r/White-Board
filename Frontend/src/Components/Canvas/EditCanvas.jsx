import React, { useState } from 'react';
import classes from './EditCanvas.module.css';
import { 
  FiChevronLeft, FiSettings, FiUsers, FiGlobe, 
  FiLock, FiTrash2, FiUserPlus, FiX, FiShare2 
} from "react-icons/fi";

const EditCanvas = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [visibility, setVisibility] = useState('private');

  return (
    <div className={classes.editWrapper}>
      <div className={classes.backdrop} onClick={onClose} />

      <div className={classes.container}>
        <aside className={classes.sidebar}>
          <div className={classes.sidebarTop}>
            <button className={classes.backBtn} onClick={onClose}>
              <FiChevronLeft /> Back to Dashboard
            </button>
            
            <nav className={classes.nav}>
              <div 
                className={`${classes.navLink} ${activeTab === 'general' ? classes.active : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <FiSettings /> General
              </div>
              <div 
                className={`${classes.navLink} ${activeTab === 'collab' ? classes.active : ''}`}
                onClick={() => setActiveTab('collab')}
              >
                <FiUsers /> Collaborators
              </div>
              <div className={classes.navLink}>
                <FiShare2 /> Share Link
              </div>
            </nav>
          </div>

          <button className={classes.dangerZoneNav}>
             <FiTrash2 /> Delete Canvas
          </button>
        </aside>

        <main className={classes.mainContent}>
          {activeTab === 'general' && (
            <div className={classes.section}>
              <h2 className={classes.sectionTitle}>General Settings</h2>
              <div className={classes.inputGroup}>
                <label className={classes.label}>Canvas Title</label>
                <input type="text" placeholder="Project Phoenix" className={classes.textInput} />
              </div>

              <div className={classes.inputGroup}>
                <label className={classes.label}>Visibility</label>
                <div className={classes.visibilityGrid}>
                  <div 
                    className={`${classes.visCard} ${visibility === 'public' ? classes.activeVis : ''}`}
                    onClick={() => setVisibility('public')}
                  >
                    <div className={classes.visIcon}><FiGlobe /></div>
                    <div className={classes.visText}>
                      <p>Public</p>
                      <span>Anyone with the link can edit</span>
                    </div>
                  </div>
                  <div 
                    className={`${classes.visCard} ${visibility === 'private' ? classes.activeVis : ''}`}
                    onClick={() => setVisibility('private')}
                  >
                    <div className={classes.visIcon}><FiLock /></div>
                    <div className={classes.visText}>
                      <p>Private</p>
                      <span>Only invited members can access</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className={classes.updateBtn}>Save Changes</button>
            </div>
          )}

          {activeTab === 'collab' && (
            <div className={classes.section}>
              <h2 className={classes.sectionTitle}>Collaborators</h2>
              
              <div className={classes.inviteWrapper}>
                <div className={classes.inviteInputGroup}>
                   <FiUserPlus className={classes.inputIcon} />
                   <input type="email" placeholder="Add collaborator by email..." className={classes.inviteInput} />
                </div>
                <button className={classes.inviteBtn}>Invite</button>
              </div>

              <div className={classes.collabList}>
                <div className={classes.listLabel}>Current Members</div>
                {[
                  { name: 'Sarah J', role: 'Owner', email: 'sarah@zenith.com' },
                  { name: 'Alex R', role: 'Editor', email: 'alex@work.com' },
                  { name: 'Mike D', role: 'Editor', email: 'mike@studio.com' }
                ].map((user, i) => (
                  <div key={i} className={classes.collabItem}>
                    <div className={classes.userInfo}>
                      <div className={classes.avatarSmall}>{user.name[0]}</div>
                      <div className={classes.userText}>
                         <p>{user.name} <span>({user.role})</span></p>
                         <span>{user.email}</span>
                      </div>
                    </div>
                    {user.role !== 'Owner' && (
                      <button className={classes.removeBtn} title="Remove">
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditCanvas;