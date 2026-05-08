import React, { useState } from 'react';
import classes from './Home.module.css';
import CreateCanvasModal from '../Canvas/CreateCanvas.jsx';
import { 
  FiHome, FiGrid, FiUsers, FiSettings, FiPlus, 
  FiSearch, FiBell, FiEdit2, FiShare2, FiTrash2, 
  FiChevronLeft, FiChevronRight 
} from "react-icons/fi";

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canvases = [
    { id: 1, title: "Project Phoenix: Brainstorm", edited: "3 mins ago", tag: "Canvas Title" },
    { id: 2, title: "UI Wireframes - App v3", edited: "1 hour ago", tag: "Canvas Title" },
    { id: 3, title: "Algorithm Logic Sync", edited: "Yesterday", tag: "Canvas Title" },
    { id: 4, title: "Marketing Strategy", edited: "3 mins ago", tag: "Canvas Title" },
    { id: 5, title: "Daily Standup Notes", edited: "1 hour ago", tag: "Canvas Title" },
    { id: 6, title: "Mobile Mockups", edited: "Yesterday", tag: "Canvas Title" },
  ];

  const friends = [
    { name: "Alex R.", status: "Online" },
    { name: "Sarah L.", status: "Online" },
    { name: "Mike D.", status: "Online" },
    { name: "Chloe B.", status: "Online" },
    { name: "Liam K.", status: "Online" },
  ];

  return (
    <div className={`${classes.layout} ${isCollapsed ? classes.sidebarCollapsed : ''}`}>
      <aside className={classes.sidebar}>
        <div className={classes.logoSection}>
          <div className={classes.logoIcon}>Z</div>
          {!isCollapsed && <h1 className={classes.brandName}>ZenithBoard</h1>}
        </div>

        <button 
          className={classes.toggleBtn} 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>

        <nav className={classes.sideNav}>
          <div className={`${classes.navItem} ${classes.active}`} title="Home">
            <FiHome /> {!isCollapsed && <span>Home</span>}
          </div>
          <div className={classes.navItem} title="My Canvases">
            <FiGrid /> {!isCollapsed && <span>My Canvases</span>}
          </div>
          <div className={classes.navItem} title="Friends">
            <FiUsers /> {!isCollapsed && <span>Friends</span>}
            {!isCollapsed && <span className={classes.badge}>0</span>}
          </div>
          <div className={classes.navItem} title="Settings">
            <FiSettings /> {!isCollapsed && <span>Settings</span>}
          </div>
        </nav>

        <button className={classes.createSidebarBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> {!isCollapsed &&<span id={classes.createBtn}>Create New Canvas</span>}
        </button>

        {!isCollapsed && (
          <div className={classes.friendsSection}>
            <h3>Friends</h3>
            {friends.map((f, i) => (
              <div key={i} className={classes.friend}>
                <div className={classes.avatar} />
                <div className={classes.friendInfo}>
                  <p>{f.name}</p>
                  <span>{f.status}</span>
                </div>
                <div className={classes.onlineStatus} />
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className={classes.mainContent}>
        <header className={classes.topHeader}>
          <div className={classes.searchContainer}>
            <FiSearch className={classes.searchIcon} />
            <input type="text" placeholder="Search canvases..." />
          </div>
          <div className={classes.headerActions}>
            <div className={classes.notification}>
              <FiBell />
              <span className={classes.notifBadge}>1</span>
            </div>
            <div className={classes.profile}>
              <div className={classes.avatarSmall} />
              <span>Sarah J.</span>
            </div>
          </div>
        </header>

        <div className={classes.canvasGridHeader}>
          <h2>My Canvases <span>({canvases.length})</span></h2>
        </div>

        <div className={classes.grid}>
          {canvases.map(canvas => (
            <div key={canvas.id} className={classes.card}>
              <div className={classes.cardTop}>
                <span>{canvas.tag}</span>
                <h4>{canvas.title}</h4>
                <p>Last edited: {canvas.edited}</p>
              </div>
              
              <div className={classes.previewBox}>
                <div className={classes.miniGrid}></div>
              </div>

              <div className={classes.cardActions}>
                <button title="Edit"><FiEdit2 /></button>
                <button title="Share"><FiShare2 /></button>
                <button title="Delete"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && <CreateCanvasModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;