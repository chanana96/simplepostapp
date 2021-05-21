module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('You are not logged in!');
        res.redirect('/users/login');
    }
}