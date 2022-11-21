// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;
/**
 * @title Pingo Contract
 * @dev Store & retrieve value in a variable
 */
contract PingoContract {

    event AddPost(address recipient, uint postId);
    event DeletePost(uint postId, bool isDeleted);

    struct Post {
        uint id;
        address username;
        string postText;
        string postVid;
        bool isDeleted;
    }

    Post[] private posts;

    // Mapping of POST id to the wallet address of the user
    mapping(uint256 => address) postToOwner;

    // Method to be called by our frontend when trying to add a newPOST
    function addPost(string memory postText, string memory postVid, bool isDeleted) external {
        uint postId = posts.length;
        posts.push(Post(postId, msg.sender, postText, postVid, isDeleted));
        postToOwner[postId] = msg.sender;
        emit AddPost(msg.sender, postId);
    }

    // Method to get all the POST
    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory temporary = new Post[](posts.length);
        uint counter = 0;
        for(uint i=0; i<posts.length; i++) {
            if(posts[i].isDeleted == false) {
                temporary[counter] = posts[i];
                counter++;
            }
        }

        Post[] memory result = new Post[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to get only your Posts
    function getMyPosts() external view returns (Post[] memory) {
        Post[] memory temporary = new Post[](posts.length);
        uint counter = 0;
        for(uint i=0; i<posts.length; i++) {
            if(postToOwner[i] == msg.sender && posts[i].isDeleted == false) {
                temporary[counter] = posts[i];
                counter++;
            }
        }

        Post[] memory result = new Post[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to Delete a Tweet
    function deletePost(uint postId, bool isDeleted) external {
        if(postToOwner[postId] == msg.sender) {
            posts[postId].isDeleted = isDeleted;
            emit DeletePost(postId, isDeleted);
        }
    }

}