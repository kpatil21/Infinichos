const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check Login
 */
  
  const authMiddleware = (req, res, next ) => {
      const token = req.cookies.token;

      if(!token)
      {
        return res.status(401).json( { message: 'Unauthorized' } );
      }

      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
      } catch(error)
      {
        return res.status(401).json( { message: 'Unauthorized' } );
      }

  }






/**
 * GET /
 * Admin - Login Page
 */

router.get('/admin', async (req, res) => {
    //res.send("Hello world!");
   
    try {
       
        const locals = {
            title: "Admin",
            description: "simple Blog created with Nodejs Express & MongoDb."
        }
    

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
    
});
/**
 * Post /
 * Admin - check login
 */
router.post('/admin', async (req, res) => {
   
   
    try {
       const { username, password } = req.body;
       
       const user = await User.findOne({ username });

       if(!user)
       {
        return res.status(401).json( { message: 'Invalid credentials' } );
       }

       const isPasswordvalid = await bcrypt.compare(password, user.password);
         if(!isPasswordvalid)
         {
            return res.status(401).json( { message: 'Invalid credentials' } );
         }

         const token = jwt.sign({ userId: user._id }, jwtSecret);
         res.cookie('token', token, { httpOnly: true });
         res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
    }
    
});

/**
 * GET /
 * Admin - Dashboard
 */

router.get('/dashboard', authMiddleware, async (req, res) => { 


       try {

        const locals = {
          title: "DashBoard",
          description: "simple Blog created with Nodejs Express & MongoDb."
      }

        const data = await Post.find();
        res.render('admin/dashboard', {
              locals,
              data,
              layout: adminLayout
        } );
  
       } catch (error) {
          console.log(erro);
       }
       
});

/**
 * GET /
 * Admin - Create Post
 */

router.get('/add-post', authMiddleware, async (req, res) => { 


  try {

   const locals = {
     title: "Create New Post",
     description: "simple Blog created with Nodejs Express & MongoDb."
 }

   const data = await Post.find();
   res.render('admin/add-post', {
         locals,
         layout: adminLayout
   } );

  } catch (error) {
     console.log(erro);
  }
  
});

/**
 * POST /
 * Admin - Create Post
 */
router.post('/add-post', authMiddleware, async (req, res) => { 


  try {
          
      try {
        const newpost = new Post({
          title: req.body.title,
          body: req.body.body,
          image: req.body.body
        });

        await Post.create(newpost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }


  } catch (error) {
     console.log(erro);
  }
  
});


/**
 * GET /
 * Admin - Edit Post
 */

router.get('/edit-post/:id', authMiddleware, async (req, res) => { 


  try {
     
    const locals = {
      title: "Edit Post",
      description: "simple Blog created with Nodejs Express & MongoDb."
  }
    

    const data = await Post.findOne({ _id: req.params.id });
 
    res.render('admin/edit-post', {
      locals,
       data,
       layout: adminLayout
    });

  } catch (error) {
     console.log(error);
  }
  
});



/**
 * PUT /
 * Admin - Edit Post
 */

router.get('/edit-post/:id', authMiddleware, async (req, res) => { 


  try {
     
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
    });
    res.redirect(`/edit-post/${req.params.id}`);

  } catch (error) {
     console.log(error);
  }
  
});







/*
router.post('/admin', async (req, res) => {
     
    try {
       const { username, password } = req.body;
       //console.log(req.body);
       
       res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
    
});
 */

/**
 * Post /
 * Admin - Register
 */
router.post('/register', async (req, res) => {
    //res.send("Hello world!");
   
    try {
       const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
   
    
    try {
        
      const user = await User.create({ username, password:hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }


    } catch (error) {
        console.log(error);
    }
    
});

/**
 * DELETE /
 * Admin - Delete Post
 */

router.delete('/delete-post/:id', authMiddleware, async (req, res) => { 
  
  try {
    
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }
 
});

/**
 * GET /
 * Admin - Logout
 */

router.get('/logout', (req, res) => {
     res.clearCookie('token');
     res.redirect('/');

});


module.exports = router;