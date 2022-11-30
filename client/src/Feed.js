import React from 'react';
import { useState, useEffect } from 'react';
import PostBox from './PostBox';
import Post from './Post';
import Sidebar from './Sidebar';
import './Feed.css';
import { PingoContractAddress } from './config';
import { ethers } from 'ethers';
import Pingo from './utils/PingoContract.json';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';


const projectId = '2I4fSTozAriHRIzEYG6hTXWuQev';
const projectSecret = '43ae8fb1b0e2ed2a904dcfa5b6a8722f';
const authorization = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


export default function Feed({ personal }) {
  const [posts, setPosts] = useState([]);

  const [images, setImages] = useState([]);
  const ipfs = ipfsHttpClient({
    url: 'https://ipfs.infura.io:5001',
    headers: {
      authorization,
    },
  });
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert('No files selected');
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);

    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);

    form.reset();
  };

  const getUpdatedPosts = (allPosts, address) => {
    let updatedPosts = [];
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].username.toLowerCase() === address.toLowerCase()) {
        let post = {
          id: allPosts[i].id,
          postText: allPosts[i].postText,
          postVid: allPosts[i].postVid,
          isDeleted: allPosts[i].isDeleted,
          username: allPosts[i].username,
          personal: true,
        };
        updatedPosts.push(post);
      } else {
        let post = {
          id: allPosts[i].id,
          postText: allPosts[i].postText,
          postVid: allPosts[i].postVid,
          isDeleted: allPosts[i].isDeleted,
          username: allPosts[i].username,
          personal: false,
        };
        updatedPosts.push(post);
      }
    }
    return updatedPosts;
  };

  const getAllPosts = async () => {
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
        let allPosts = await PingoContract.getAllPosts();
        setPosts(getUpdatedPosts(allPosts, ethereum.selectedAddress));
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const deletePost = (key) => async () => {
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
        let deletedPostTx = await PingoContract.deletePost(key, true);
        let allPosts = await PingoContract.getAllPosts();
        setPosts(getUpdatedPosts(allPosts, ethereum.selectedAddress));
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <PostBox />

      {ipfs && (
        <>
          <h3>Upload file to IPFS</h3>
          <form onSubmit={onSubmitHandler}>
            <input type="file" name="file" />
            <button type="submit">Upload file</button>
          </form>
        </>
      )}

      <div>
        {images.map((image, index) => (
          <img
            alt={`Uploaded #${index + 1}`}
            src={'https://pingo.infura-ipfs.io/ipfs/' + image.path}
            style={{ maxWidth: '400px', margin: '15px' }}
            key={image.cid.toString() + index}
          />
        ))}
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
