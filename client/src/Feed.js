import React from 'react';
import { useState, useEffect } from 'react';
import PostBox from './PostBox';
import Post from './Post';
import './Feed.css';
import { PingoContractAddress } from './config';
import { ethers } from 'ethers';
import Pingo from './utils/PingoContract.json';
import FlipMove from "react-flip-move";


export default function Feed({personal}) {
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

  const getAllPosts = async() => {
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
        let allPosts = await PingoContract.getAllPosts();
        setPosts(getUpdatedPosts(allPosts, ethereum.selectedAddress))
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getAllPosts();
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
    <div className="feed">
    <div className="feed__header">
      <h2>Home</h2>
    </div>

    <PostBox />

    <FlipMove>
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
    </FlipMove>
  </div>
);
}
