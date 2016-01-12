var express = require('express');
var router = express.Router();

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
    res.send({message:"TODO read all posts in the database"});
  })
  .post(function(req,res){
    res.send({message:"TODO create a new post in the database"});
  });

//api for a specfic post
router.route('/posts/:id')

  //create
  .put(function(req,res){
      return res.send({message:'TODO modify an existing post by using param ' + req.param.id});
  })

  .get(function(req,res){
      return res.send({message:'TODO get an existing post by using param ' + req.param.id});
  })

  .delete(function(req,res){
      return res.send({message:'TODO delete an existing post by using param ' + req.param.id})
  });

module.exports = router;
