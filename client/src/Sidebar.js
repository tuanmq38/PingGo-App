import React from 'react';
import './Sidebar.css';
import SidebarOption from './SideBarOption';
import logo from './images/Pingo-logo.png';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { BrowserRouter, Outlet, Link } from 'react-router-dom';
import Profile from './Profile';

function Sidebar({ walletAddress }) {
  return (
    <div className="sidebar">
      <a href='/'><img src={logo} alt=""></img></a>
        <Link to="/">
          <SidebarOption Icon={HomeIcon} text="Home" />
        </Link>
        <Link to="/profile">
          <SidebarOption Icon={PersonIcon} text="Profile" />
        </Link>
        <Link to="/">
          <SidebarOption Icon={SettingsIcon} text="Settings" />{' '}
        </Link>
     
      <div className="sidebar__category">
        <p className="">
          <button>&#128187; Coding</button>
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
