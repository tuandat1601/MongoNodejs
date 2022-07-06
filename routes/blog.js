const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const db = require("../data/database");
router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const posts = await db.getDB().collection('posts').find({},{title:1,summary:1,'author.name':1}).toArray()
  res.render('posts-list', { posts: posts });
});
router.get("/posts/:id", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDB()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { summary: 0 });
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

  const postData = {
    ...post,
    data: post.date = new Date(),
    humanReadableDate: post.date.toLocaleDateString('en-US', options)
  };
  if (!post) {
    return res.status(404).render('404')
  }

  res.render('post-detail', { post: postData })
})

router.get('/new-post', async function (req, res) {
  const authors = await db.getDB().collection('authors').find({}, { title: 1, summary: 1, 'author.name': 1 }).toArray();
  console.log(authors)
  res.render('create-post', { authors: authors });

});
router.post('/posts', async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db.getDB().collection('authors').findOne({ _id: authorId });
  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email
    }
  }
  const result = await db.getDB().collection('posts').insertOne(newPost)
  console.log(result)
  res.redirect('/posts')
})
router.get('/posts/:id/edit', async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDB()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });
  if (!post) {
    return res.status(404).render('404')
  }
  res.render('update-post', { post: post })
})
router.post('/posts/:id/edit', async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db.getDB().collection('posts').updateOne({ _id: postId }, {
    $set: {
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.content
    }
  })
  res.redirect("/posts")
})
router.post('/posts/:id/delete', async function (req, res){
  const postId = new ObjectId(req.params.id);
  const result = await db.getDB().collection('posts').deleteOne({_id:postId})
  res.redirect("/posts")
} )
module.exports = router;