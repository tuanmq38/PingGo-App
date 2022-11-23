import React from 'react';
import './Sidebar.css';
import SidebarOption from './SideBarOption';
import logo from './images/Pingo-logo.png';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Sidebar({ walletAddress }) {
  return (
    // <div className="sidebar">
    //   <img src={logo} alt=''></img>
    //   <BrowserRouter>
    //   <Link to="/profile">
    //   <SidebarOption Icon={PersonIcon} text="Profile" />
    //   </Link>

    //     <Routes>
    //       <Route path="/profile" element={Profile}></Route>
    //     </Routes>
    //   </BrowserRouter>
    // </div>

    <div className="sidebar">
      <img src={logo} alt=""></img>
      <SidebarOption Icon={HomeIcon} text="Home" />
      <SidebarOption Icon={PersonIcon} text="Profile" />
      <SidebarOption Icon={SettingsIcon} text="Settings" />

      <hr />
      <div className="sidebar__category">
        <p className="">
          <button>&#128187; Development</button>
          <button>&#129367; Cooking</button>
          <button>&#129698; Handicrafts</button>
          <button>&#128214; Language</button>

        </p>
      </div>

      

      <div className="sidebar__walletAddress">
        <span>Wallet Address:</span> {walletAddress.slice(0, 4)}...
        {walletAddress.slice(38)}
      </div>
    </div>
  );
}

export default Sidebar;
