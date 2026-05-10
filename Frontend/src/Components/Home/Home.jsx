import React, { useEffect, useState } from "react";
import classes from "./Home.module.css";
import CreateCanvasModal from "../Canvas/CreateCanvas.jsx";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiSettings,
  FiPlus,
  FiSearch,
  FiBell,
  FiEdit2,
  FiShare2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { FiGlobe, FiLock } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditCanvas from "../Canvas/EditCanvas.jsx";

const Home = () => {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleEditClose = () => {
    setIsEditOpen(false);
  }

  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const friends = [
    { name: "Alex R.", status: "Online" },
    { name: "Sarah L.", status: "Online" },
    { name: "Mike D.", status: "Online" },
    { name: "Chloe B.", status: "Online" },
    { name: "Liam K.", status: "Online" },
  ];

  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://zenithboard-api.onrender.com/api/canvas",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
      if (Array.isArray(data)) {
        setCanvases(data);
      } else {
        setCanvases([]);
      }
      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    };

    fetchCanvases();
  }, []);

  const handleDeleteCanvas = async (canvasId) => {
    try {
      await axios.delete(
        `https://zenithboard-api.onrender.com/api/canvas/${canvasId}`,
        {
          withCredentials: true,
        }
      );

      setCanvases((prev) =>
        prev.filter((canvas) => canvas._id !== canvasId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCanvases = canvases.filter((canvas) =>
    canvas.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`${classes.layout} ${
        isCollapsed ? classes.sidebarCollapsed : ""
      }`}
    >
      <aside className={classes.sidebar}>
        <div className={classes.logoSection}>
          <div className={classes.logoIcon}>Z</div>

          {!isCollapsed && (
            <h1 className={classes.brandName}>
              ZenithBoard
            </h1>
          )}
        </div>

        <button
          className={classes.toggleBtn}
          onClick={() =>
            setIsCollapsed(!isCollapsed)
          }
        >
          {isCollapsed ? (
            <FiChevronRight />
          ) : (
            <FiChevronLeft />
          )}
        </button>

        <nav className={classes.sideNav}>
          <div
            className={`${classes.navItem} ${classes.active}`}
          >
            <FiHome />

            {!isCollapsed && <span>Home</span>}
          </div>

          <div className={classes.navItem}>
            <FiGrid />

            {!isCollapsed && (
              <span>My Canvases</span>
            )}
          </div>

          <div className={classes.navItem}>
            <FiUsers />

            {!isCollapsed && <span>Friends</span>}

            {!isCollapsed && (
              <span className={classes.badge}>
                0
              </span>
            )}
          </div>

          <div className={classes.navItem}>
            <FiSettings />

            {!isCollapsed && (
              <span>Settings</span>
            )}
          </div>
        </nav>

        <button
          className={classes.createSidebarBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus />

          {!isCollapsed && (
            <span id={classes.createBtn}>
              Create New Canvas
            </span>
          )}
        </button>

        {!isCollapsed && (
          <div className={classes.friendsSection}>
            <h3>Friends</h3>

            {friends.map((f, i) => (
              <div
                key={i}
                className={classes.friend}
              >
                <div className={classes.avatar} />

                <div
                  className={classes.friendInfo}
                >
                  <p>{f.name}</p>

                  <span>{f.status}</span>
                </div>

                <div
                  className={classes.onlineStatus}
                />
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className={classes.mainContent}>

  {/* FIXED TOP SECTION */}
  <div className={classes.fixedTop}>
    
    <header className={classes.topHeader}>
      <div className={classes.searchContainer}>
        <FiSearch className={classes.searchIcon} />

        <input
          type="text"
          placeholder="Search canvases..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className={classes.headerActions}>
        <div className={classes.notification}>
          <FiBell />

          <span className={classes.notifBadge}>
            1
          </span>
        </div>

        <div className={classes.profile}>
          <div className={classes.avatarSmall} />

          <span>Sarah J.</span>
        </div>
      </div>
    </header>

    <div className={classes.canvasGridHeader}>
      <h2>
        My Canvases{" "}
        <span>
          ({filteredCanvases.length})
        </span>
      </h2>
    </div>

  </div>

  <div className={classes.cardsContainer}>

    {loading ? (
      <div className={classes.shimmerGrid}>
        {[...Array(21)].map((_, index) => (
          <div
            key={index}
            className={classes.shimmerCard}
          >
            <div className={classes.shimmerTop}>
              <div className={classes.shimmerTag}></div>

              <div className={classes.shimmerTitle}></div>

              <div className={classes.shimmerText}></div>
            </div>

            <div className={classes.shimmerPreview}></div>

            <div className={classes.shimmerActions}>
              <div className={classes.shimmerBtn}></div>
              <div className={classes.shimmerBtn}></div>
              <div className={classes.shimmerBtn}></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className={classes.grid}>
        {filteredCanvases.map((canvas) => (
          <div
            key={canvas._id}
            className={classes.card}
          >
            {confirmDeleteId === canvas._id && (
  <div className={classes.cardAlert}>
    <p>Delete this canvas?</p>

    <div className={classes.cardAlertActions}>
      <button
        onClick={() => setConfirmDeleteId(null)}
      >
        Cancel
      </button>

      <button
        onClick={() => {
          handleDeleteCanvas(canvas._id);
          setConfirmDeleteId(null);
        }}
      >
        Delete
      </button>
    </div>
  </div>
)}
            <div className={classes.visibilityBadge}>
    {canvas.isPublic ? (
      <FiGlobe title="Public Canvas" />
    ) : (
      <FiLock title="Private Canvas" />
    )}
  </div>
            <div className={classes.cardTop}>
              <span>Canvas</span>

              <h4>{canvas.title}</h4>

              <p>
                Last edited:{" "}
                {new Date(
                  canvas.updatedAt
                ).toLocaleString()}
              </p>
            </div>

            <div
              className={classes.previewBox}
              onClick={() =>
                navigate(`/${canvas._id}`)
              }
            >
              {canvas.thumbnail ? (
                <img
                  src={canvas.thumbnail}
                  alt={canvas.title}
                  className={classes.thumbnail}
                />
              ) : (
                <div className={classes.miniGrid} />
              )}
            </div>

            <div className={classes.cardActions}>
              <button
                title="Edit"
                onClick={() =>
                  setIsEditOpen(true)
                }
              >
                <FiEdit2 />
              </button>

              <button title="Share">
                <FiShare2 />
              </button>

              <button
                title="Delete"
                className={classes.deleteBtn}
                onClick={() =>
                  setConfirmDeleteId(canvas._id)
                }
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
</main>

{isEditOpen && <EditCanvas onClose={handleEditClose}/>}

      {isModalOpen && (
        <CreateCanvasModal
          onClose={() =>
            setIsModalOpen(false)
          }
        />
      )}

      
    </div>
  );
};

export default Home;