import { Avatar } from "@material-ui/core";
import React from "react";
import "./sidebarchat.css";

function SidebarChat() {
  return (
    <div>
      <div className="sidebarChat">
        <Avatar src="https://static.toiimg.com/photo/76729750.cms" />
        <div className="sidebarChat__info">
          <h2>Tech News</h2>
          <p>I love coding </p>
        </div>
      </div>
      <div className="sidebarChat">
        <Avatar src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/7496261941582994866-512.png" />
        <div className="sidebarChat__info">
          <h2>Job Resume</h2>
          <p>Get the job done! </p>
        </div>
      </div>
    </div>
  );
}

export default SidebarChat;
