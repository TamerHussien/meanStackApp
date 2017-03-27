var FacebookStrategy = require('passport-facebook').Strategy,

TwitterStrategy = require('passport-twitter').Strategy;


var User = require('../models/user');

var session = require('express-session');

var jwt = require('jsonwebtoken');

var secret = 'harrypotter';


module.exports = function (app, passport) {
    
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false }}));

    
    passport.serializeUser(function(user, done) {
        
    token =  jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '24h' });

        
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

    passport.use(new FacebookStrategy({
    clientID: '698628453631896',
    clientSecret: '85deea6aa38d3b20fa8fff585efc983c',
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.email);
        User.findOne({email: profile._json.email}).select('username password email ').exec(function(err, user){
           
            if (err) done(err);
            
            if (user && user != null){
                done(null, user);
            } else {
                
                done(err);
            }
            
        });
        
  }
));
    

passport.use(new TwitterStrategy({
    consumerKey: 'DQW7tkg0PUiDqdj2aL6ToIwSl',
    consumerSecret: 'TPkhHCXEh0X8efAaZrT6ePWSjnusLAbrCNKujm3mRTBxTXxsRx',
    callbackURL: "http://localhost:8000/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  },
  function(token, tokenSecret, profile, done) {
    
    console.log(profile.emails[0].value);
    
    User.findOne({email: profile.emails[0].value}).select('username password email ').exec(function(err, user){
           
            if (err) done(err);
            
            if (user && user != null){
                done(null, user);
            } else {
                
                done(err);
            }
             
        });
  }
));
    

    app.get('/auth/twitter', passport.authenticate('twitter'));


    app.get('/auth/twitter/callback',passport.authenticate('twitter', {failureRedirect: '/twittererror' }), function(req, res){
        
        res.redirect('/twitter/' + token);
    });
    
    app.get('/auth/facebook/callback',passport.authenticate('facebook', {failureRedirect: '/facebookerror' }), function(req, res){
        
        res.redirect('/facebook/' + token);
    });
    
    app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' }));

    return passport;
}