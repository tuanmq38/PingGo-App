import React, { useState, useEffect } from 'react';
import './PostBox.css';
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import { Button } from '@material-ui/core';
import { PingoContractAddress } from './config.js';
import { ethers } from 'ethers';
import Pingo from './utils/PingoContract.json';

function PostBox() {
  const [postMessage, setPostMessage] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postVid, setPostVid] = useState('');
  const [avatarOptions, setAvatarOptions] = useState('');

  const addPost = async () => {
    let post = {
      postText: postMessage,
      postVid: postVid,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PingoContract = new ethers.Contract(
          PingoContractAddress,
          Pingo.abi,
          signer
        );

        let pingoTx = await PingoContract.addPost(
          post.postText,
          post.postVid,
          post.isDeleted
        );

        console.log(pingoTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log('Error submitting new post', error);
    }
  };

  const sendPost = (e) => {
    e.preventDefault();

    addPost();

    setPostMessage('');
    setPostImage('');
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);

  return (
    <div className="postBox">
      <form>
        <div className="postBox__input">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle="Circle"
            {...avatarOptions}
          />
          <input
            onChange={(e) => setPostMessage(e.target.value)}
            value={postMessage}
            placeholder="What do you want to share?"
            type="text"
          />
        </div>
        <input
          value={postImage}
          onChange={(e) => setPostImage(e.target.value)}
          className="postBox__videoInput"
          placeholder="Optional: Enter video URL"
          type="text"
        />

        <Button
          onClick={sendPost}
          type="submit"
          className="postBox__postButton"
        >
          Post
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
