var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');

//add a middleware for auth
router.use('/posts', function(req,res,next){
  //allow all get request methods
  if(req.method === "GET"){
      return next();
  }
  if (req.isAuthenticated()){
      return next();
  }
  // if the user is not authenticated then redirect him to the login page
  return res.redirect('/#login');
});


//api for a all posts
router.route('/posts')
  .get(function(req,res){
    console.log("request : get posts");
    Post.find(function(err, posts){
      if(err){
          return res.send(500, err);
      }
      return res.send(posts);
    });
  })
  .post(function(req,res){
    console.log("request : create new post");
    var post = new Post();
    post.text = req.body.text;
    post.created_by = req.body.created_by;
    post.save(function(err, post) {
        if (err){
            return res.send(500, err);
        }
        return res.json(post);
    });
  });

//post-specific commands. likely won't be used
router.route('/posts/:id')
    //gets specified post
    .get(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });
    })
    //updates specified post
    .put(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function(err, post){
                if(err)
                    res.send(err);

                res.json(post);
            });
        });
    })
    //deletes the post
    .delete(function(req, res) {
        Post.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });


module.exports = router;
