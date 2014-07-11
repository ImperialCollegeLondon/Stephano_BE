var crypto = require('crypto');

function User () {
    this.id = undefined;
    this.firstName = undefined;
    this.lastName = undefined;
    this.email = undefined;
}

User.prototype.add = function(db, callback)
{
    db.addObject(User, this, function(result, err){
        this.addUserCallback(result, err, callback)
    }.bind(this));
};

User.prototype.addUserCallback = function (err, result, callback)
{
    if(err)
    {
        callback(err, false);
        return;
    }
    this.id = result.insertId;
    callback(null, true);
};

User.prototype.delete = function(db, callback)
{
    db.deleteObject(User, { "email" : this.email }, callback);
};

User.findOne = function(email, db, callback)
{

    db.findObject(User, { "email" : email }, function(err, rows) {
        User.findOneCallback(err, rows, callback);
    });
};

User.findOneCallback = function(err, rows, callback)
{
    if(err){
        callback(err, null);
        return;
    }
    else if(!rows || rows.length == 0)
    {
        callback(null, []);
        return;
    }
    else if(rows.length > 1)
    {
        err = "More than one user found";
        callback(err, null);
        return;
    }
    else
    {
        var result = User.fromRow(rows[0]);
        callback(null, result);
        return;
    }

};

User.fromRow = function(row)
{
    var user = new User();
    for( var key in row )
    {
        user[key] = row[key];
    }
    return user;
};

function Authenticator () {
    this.id = null;
    this.user_id = null;
    this.authenticator_data = null;
    this.protocol = null;
}

Authenticator.fromRow = function(row)
{
    var auth = new Authenticator();
    for( var key in row )
    {
        auth[key] = row[key];
    }
    return auth;
};

Authenticator.prototype.check = function(auth_data)
{

}

Authenticator.prototype.add = function(db)
{

}



module.exports = { User : User, Authenticator : Authenticator };
