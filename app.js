var express = require('express'),
    passport = require('passport'),
    auth = require('passport-http'),
    DBDriver = require('./Interfaces/MySQL.js'),
    config = require('./config.json'),
    User = require('./interfaces/User.js'),
    Metadata = require('./Interfaces/Metadata.js'),
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
var require_password = passport.authenticate('digest', {session:false} )

app.get('/api/datasets', function(req, res)
{
    res.send(Object.keys(config));
});

app.get('/api/:dataset/config',require_password, function(req, res)
{
    var dataset = req.params.dataset,
        cfg = config[dataset];

    res.send(filterConfig(cfg));
});

app.get('/api/:dataset/tree.nwk',require_password, function(req, res)
{
    var dataset = req.params.dataset,
        cfg = config[dataset];

    require('fs').readFile(cfg.treeFile, { encoding : 'utf8' } ,function(err, data){
        if(err){
            res.send('file not found');
        }
        else
        {
            res.send(data);
        }
    });
});

app.get('/api/:dataset/meta', require_password, function(req, res)
{
     var dataset = req.params.dataset,
        cfg = config[dataset],
        db = new DBDriver(cfg.connection),
        metadata=  new Metadata(cfg);

    metadata.getTable(function(err,data){
        res.send(data);
    });
});

app.get('/api/:dataset/meta/:field', require_password, function(req, res)
{
     var dataset = req.params.dataset,
        cfg = config[dataset],
        db = new DBDriver(cfg.connection),
        metadata=  new Metadata(cfg);

    metadata.getGroupings(req.params.field, function(err,data){
        res.send(data);
    });
});

app.get('/api/:dataset/geo', require_password, function(req, res)
{
    var dataset = req.params.dataset,
        cfg = config[dataset],
        db = new DBDriver(cfg.connection),
        metadata=  new Metadata(cfg);

    metadata.getGeoJson(function(data){
        res.send(data);
    });
});

app.get('/api/:dataset/labels', require_password, function(req, res)
{
    var dataset = req.params.dataset,
        cfg = config[dataset];

    res.send(cfg.labelFunctions);
});



//Logout is redundant for HTTP Auth

function filterConfig(cfg){
    var new_cfg = cfg.panels;

    return new_cfg;
}

app.listen(3000);
