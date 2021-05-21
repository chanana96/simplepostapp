const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Createpost = require('../models/Createpost');

router.get('/', (req,res)=>res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, async (req,res)=> {
    const newPost = await Createpost.find().sort({ date: 'desc'})
    res.render('Dashboard', {name:req.user.name, newPost:newPost})
})


module.exports = router;