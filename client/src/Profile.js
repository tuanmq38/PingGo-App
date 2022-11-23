import React from 'react';
import { useState, useEffect } from 'react';
import PostBox from './PostBox';
import Post from './Post';
import Sidebar from './Sidebar';
import './Feed.css';
import "./Profile.css";
import { PingoContractAddress } from './config';
import { ethers } from 'ethers';
import Pingo from './utils/PingoContract.json';
import FlipMove from "react-flip-move";


export default function Profile({personal}) {
  const [posts, setPosts] = useState([]);

 

  const getUpdatedPosts = (allPosts, address) => {
    let updatedPosts = [];
    for(let i=0; i<allPosts.length; i++) {
      if(allPosts[i].username.toLowerCase() === address.toLowerCase()) {
        let post = {
          'id': allPosts[i].id,
          'postText': allPosts[i].postText,
          'postVid' : allPosts[i].postVid,
          'isDeleted': allPosts[i].isDeleted,
          'username': allPosts[i].username,
          'personal': true
        };
        updatedPosts.push(post);
      } else {
        let post = {
          'id': allPosts[i].id,
          'postText': allPosts[i].postText,
          'postVid' : allPosts[i].postVid,
          'isDeleted': allPosts[i].isDeleted,
          'username': allPosts[i].username,
          'personal': false
        };
        updatedPosts.push(post);
      }
    }
    return updatedPosts;

  }

  const getMyPosts = async() => {
    try {
      const {ethereum} = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PingoContract = new ethers.Contract(
          PingoContractAddress,
          Pingo.abi,
          signer
        )
        let allPosts = await PingoContract.getMyPosts();
        setPosts(getUpdatedPosts(allPosts, ethereum.selectedAddress))
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMyPosts();
  }, []);

  const deletePost = key => async() => {
    try {
      const {ethereum} = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PingoContract = new ethers.Contract(
          PingoContractAddress,
          Pingo.abi,
          signer
        )
        let deletedPostTx = await PingoContract.deletePost(key, true);
        let allPosts = await PingoContract.getAllPosts();
        setPosts(getUpdatedPosts(allPosts, ethereum.selectedAddress))
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <div className="profile">
    <div className="profile__header">
      <h2>Profile</h2>
    </div>

    <PostBox />
    <div className='profile__tabs'>
        <div className='profile__tab'>My Post</div>
    </div>

      {posts.map((post) => (
        <Post
          key={post.id}
          displayName={post.username}   
          text={post.postText}
          vid={post.postVid}
          personal={post.personal}
          onClick={deletePost(post.id)}
        />
      ))}
       
  </div>
);
}
