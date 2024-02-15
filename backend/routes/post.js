const express = require('express');
const { createPost } = require('../controller/post');

const router = express.Router();

router.route("/post/upload").post(createPost);

module.exports = router;


