const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


//Routes
/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    //res.send("Hello world!");

    try {
        const locals = {
            title: "Infinichos",
            description: " "
        }

        let perPage =10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();


        //const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);






    
        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
            
        }); 
    } catch (error) {
        console.log(error);
    }
    
});

/*router.get('', async (req, res) => {
    //res.send("Hello world!");
    const locals = {
        title: "Nodejs Blog",
        description: "simple Blog created with Nodejs Express & MongoDb."
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    } catch (error) {
        console.log(error);
    }
    
});*/


/**
 * GET /
 * POST :id
 */

router.get('/post/:id', async (req, res) => {

    try {
        
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "simple Blog created with Nodejs Express & MongoDb."
             
        }

        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
    
});

/**
 * POST /
 * POST : searchTerm
 */

router.post('/search', async (req, res) => {
   
    try {
        const locals = {
            title: "Search",
            description: "simple Blog created with Nodejs Express & MongoDb."
        }
        
        let searchTerm = req.body.searchTerm;
        const serchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(serchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(serchNoSpecialChar, 'i') } }
            ]
        });
        res.render('search', { data, locals });
    
    } catch (error) {
        console.log(error);
    }
    
});


router.get('/about', (req, res) => {
    //res.send("Hello world!");
   res.render('about')
    
});

//Contact
router.get('/contact', (req, res) => {
    //res.send("Hello world!");
   res.render('contact')
    
});



/*function insertPostData () {
    Post.insertMany([
        {
           title: "Building A Blog",
            body: "This Is the Body Text"
        },
        {
            title: "Building A Blog1",
             body: "This Is the Body Text1"
         },
         {
            title: "Building A Blog2",
             body: "This Is the Body Text2"
         },
         {
            title: "Building A Blog3",
             body: "This Is the Body Text3"
         },
         {
            title: "Building A Blog4",
             body: "This Is the Body Text4"
         },
         {
            title: "Building A Blog5",
             body: "This Is the Body Text5"
         },
    ]);
}

insertPostData();*/




module.exports = router;