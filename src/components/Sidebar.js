import React from "react";
import "../css/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__menuItem">Chats</div>
      <div className="sidebar__menuItem">Teams</div>
      <div className="sidebar__menuItem">Calendar</div>
      <div className="sidebar__menuItem">Files</div>
      <div className="sidebar__menuItem">Activity</div>
    </div>
  );
}

export default Sidebar;
