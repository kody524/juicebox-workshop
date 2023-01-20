const express = require('express');
const tagsRouter = express.Router();
const { getAllTags,getPostsByTagName } = require('../db');


tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  });
  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const tagName = req.params.tagName;
    
    try {
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
const tagPosts = await getPostsByTagName(tagName);
const posts = tagPosts.filter(post => {
  // the post is active, doesn't matter who it belongs to
  if (post.active) {
    return true;
  }

  // the post is not active, but it belogs to the current user
  if (req.user && post.author.id === req.user.id) {
    return true;
  }

  // none of the above are true
  return false;
});
res.send({posts})

    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next(name,message)
    }
  });








module.exports = tagsRouter;