const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, viewFollowingPosts } = require('../controller/post');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route("/post/upload").post(isAuthenticated,createPost);
router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost).delete(isAuthenticated,deletePost);
router.route("/posts").get(isAuthenticated,viewFollowingPosts);

module.exports = router;


