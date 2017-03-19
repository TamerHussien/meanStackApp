var User = require('../models/user');
var jwt = require('jsonwebtoken');

var secret = 'harrypotter'


module.exports = function(router){
    
    //http://localhost:8080/api/users
    //user registeration route
    
   router.post('/users', function(req, res){
    
    var user = new User();
    
    user.username = req.body.username;
    
    user.password = req.body.password;
    
    user.email = req.body.email;
    
    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == null || req.body.email == '' ) {
        res.json({success: false, message:'Ensure that you enter username, email and password'});
    } else {
        
        user.save(function(err){
        
        if (err){
            res.json({success: false, message: 'Username or E-mail is already registred'});
        } else {
            res.json({success: true, message:'User Added Succefully'});
        }
    });
    }
});
    
    //user login route
    //http://localhost:8080/api/authenticate
    
 router.post('/authenticate', function(req, res) { 
     
     User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) { 
         
         if (err) throw err; 
         
         if (!user) { 
             
             res.json({ success: false, message: 'login Failed' }); 
         
         } else if (user) { 
             
             if (req.body.password) { 
                 
                 var validPassword = user.comparePassword(req.body.password); 
                 
             }else { 
                 res.json({ success: false, message: 'Please enter the password' });
                 } 
             if (!validPassword) { 
                     res.json({ success: false, message: 'Invalid Password' });
             } else {
                 
                 var token =  jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '24h' });
                     
                res.json({ success: true, message: 'User Login Succefully', token: token }); 
                        
             }
         } 
     }); 
 });
    
    router.use(function(req, res, next){
       
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        
        if(token){
            jwt.verify(token, secret, function(err, decoded){
               
                if (err) {
                    res.json({success: false, message: 'token invalid'});
                }else {
                req.decoded = decoded;

                next();
                }
                
            });
            
            
        }else {
            
            res.json({success: false, message: 'no token provided'});
        }
        
    });
    
    router.post('/me', function(req, res){
        
        res.send(req.decoded);
    });
return router;
}

