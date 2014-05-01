var express = require('express'),
    passport = require('passport'),
    auth = require('passport-http'),
    DBDriver = require('./Interfaces/MySQL.js'),
    config = require('./config.json'),
    User = require('./interfaces/User.js'),
    app = express();

passport.use(new auth.DigestStrategy({ qop : 'auth'},
    function(usename, done){
        User.findOne(usename, new DBDriver(config.EARSS.connection), function(err, user){
            if(err) {
                return done(err, null);
            }
            else if(!user){
                return done(null, false, { message : "Username not recognised" });
            }
            else
            {
                return done(null, user, user.authenticator);
            }

        });
    },
    function(params, done)
     {
         done(null, true);
     }
));

app.use(passport.initialize());
app.use(function(req, res, next){
    req.db_con = new DBDriver(config.EARSS.connection);
    next();
})
app.use(passport.authenticate('digest', {session:false} ));


app.get('/', function(req, res){
    res.send('hello ' + req.user.username);
});

app.get('/logout', function(req,res)
{
    req.logout()
    res.send('logged out');
});

app.listen(3000);
