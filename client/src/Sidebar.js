import React from "react";
import "./Sidebar.css";
import SidebarOption from './SideBarOption';
import logo from './images/Pingo.png'
import HomeIcon from '@mui/icons-material/Home';

function Sidebar() {

  return (
    <div className="sidebar">
      <img src={logo} alt=''></img>
      <SidebarOption Icon={HomeIcon} text="Home" />
      
    </div>
  );
}

export default Sidebar;