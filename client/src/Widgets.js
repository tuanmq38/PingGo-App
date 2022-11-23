import React from "react";
import "./Widgets.css";
import SearchIcon from '@mui/icons-material/Search';
import pic1 from './images/Home-Hardware.png'; 
import pic2 from './images/pic2.png'

export default function Widgets() {
    return (
      <div className="widgets">
        <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
          <input placeholder="Searching..." type="text" />
        </div>
  
        <div className="widgets__widgetContainer">
          <h2>Latest News</h2>
          <a href="">
            <img src={pic1}/></a>
            <a href="">
            <img src={pic2}/></a>
        </div>
      </div>
    );
  }
  