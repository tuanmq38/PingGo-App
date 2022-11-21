const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Pingo Contract", function() {
  let Pingo;
  let pingo;
  let owner;

  const NUM_TOTAL_NOT_MY_POSTS = 5;
  const NUM_TOTAL_MY_POSTS = 3;

  let totalPosts;
  let totalMyPosts;

  beforeEach(async function() {
    Pingo = await ethers.getContractFactory("PingoContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    pingo = await Pingo.deploy();

    totalPosts = [];
    totalMyPosts = [];

    for(let i=0; i<NUM_TOTAL_NOT_MY_POSTS; i++) {
      let post = {
        'postText': 'Random text with id:- ' + i,
        'postVid': 'Random text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await pingo.connect(addr1).addPost(post.postText, post.postVid, post.isDeleted);
      totalPosts.push(post);
    }

    for(let i=0; i<NUM_TOTAL_MY_POSTS; i++) {
      let post = {
        'username': owner,
        'postText': 'Random text with id:- ' + (NUM_TOTAL_NOT_MY_POSTS+i),
        'postVid': 'Random text with id:- ' + (NUM_TOTAL_NOT_MY_POSTS+i),
        'isDeleted': false
      };

      await pingo.addPost(post.postText, post.postVid, post.isDeleted);
      totalPosts.push(post);
      totalMyPosts.push(post);
    }
  });

  describe("Add Post", function() {
    it("should emit AddPost event", async function() {
      let post = {
        'postText': 'New Text',
        'postVid': 'New Vid',
        'isDeleted': false
      };

      await expect(await pingo.addPost(post.postText, post.postVid, post.isDeleted)
    ).to.emit(pingo, 'AddPost').withArgs(owner.address, NUM_TOTAL_NOT_MY_POSTS + NUM_TOTAL_MY_POSTS);
    })
  });

  describe("Get All Posts", function() {
    it("should return the correct number of total posts", async function() {
      const postsFromChain = await pingo.getAllPosts();
      expect(postsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_POSTS+NUM_TOTAL_MY_POSTS);
    })

    it("should return the correct number of all my posts", async function() {
      const myPostsFromChain = await pingo.getMyPosts();
      expect(myPostsFromChain.length).to.equal(NUM_TOTAL_MY_POSTS);
    })
  })

  describe("Delete Post", function() {
    it("should emit delete post event", async function() {
      const POST_ID = 0;
      const POST_DELETED = true;

      await expect(
        pingo.connect(addr1).deletePost(POST_ID, POST_DELETED)
      ).to.emit(
        pingo, 'DeletePost'
      ).withArgs(
        POST_ID, POST_DELETED
      );
    })
  })
});