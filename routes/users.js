const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');


//user model
const User = require('../models/User');
const Createpost = require('../models/Createpost');

const { fileLoader } = require('ejs');



//login page
router.get('/login', (req,res)=>res.render('login'));

//register page
router.get('/register', (req,res)=>res.render('register'));


router.get('/postpage', ensureAuthenticated, (req,res)=>res.render('postpage'));

router.get('/postpage/:id', ensureAuthenticated, async (req,res)=>{
    const newPost = await Createpost.findById(req.params.id)
    res.render('Show', {newPost: newPost})
})

router.get('/editpage/:id', async (req, res) => {
    const newPost = await Createpost.findById(req.params.id)
    res.render('editpage', { newPost: newPost })
  })

//create post
router.post('/postpage', async (req,res)=> {
    let newPost = new Createpost({
        postTitle: req.body.postTitle,
        postText: req.body.postText,
    });

    try {
        newPost = await newPost.save()
        res.redirect(`/users/postpage/${newPost.id}`)
    } catch (error){
        console.log(error)
        res.render('postpage', {newPost: newPost})
    }

})

//edit post
router.put('/postpage/:id', async (req,res)=>{
    let newPost = await Createpost.findById(req.params.id)({
        postTitle: req.body.postTitle,
        postText: req.body.postText,
    });

    try {
        newPost = await newPost.save()
        res.redirect(`/users/postpage/${newPost.id}`)
    } catch (error){
        console.log(error)
        res.render('editpage', {newPost: newPost})
    }
})

//delete post
router.delete('/postpage/:id', async (req,res) =>{
    await Createpost.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard')
})




//register handle
router.post('/register', (req,res)=>{
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields!'});
    }

    //check passwords match
    if(password !== password2){
        errors.push({msg: "Passwords don't match!"});
    }

    //check password length
    if(password.length <6){
        errors.push({msg: "Password can't be under 6 characters!"});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
    });
    }
    else{
        User.findOne({email:email})
            .then(user=>{
                if(user){
                    errors.push({msg: "Email is already registered"});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                });
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //hash password

                    bcrypt.genSalt(10,(err, salt)=> 
                        bcrypt.hash(newUser.password, salt, (err,hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                            .then(user =>{
                                req.flash('success_msg', 'You are now registered!');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }
            });
    }
});

//login
router.post('/login', (req,res,next)=>{
	passport.authenticate('local',{
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req,res,next);
});

//logout
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'You logged out!');
    res.redirect('/users/login')
});

module.exports = router;