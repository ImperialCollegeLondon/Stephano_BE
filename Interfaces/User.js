function User () {
    this.username = '';
    this.authenticator = '';
    this.dataset = '';
    this.isAdmin = false;
}

User.findOne = function(username, db, callback)
{
    db.findObject(User, { "username" : username }, function(err, rows) {
        this.findOneCallback(err, rows, callback);
    }.bind(User));
};

User.findOneCallback = function(err, rows, callback)
{
    if(err){
        callback(err, null);
        return;
    }
    else if(!rows || rows.length == 0)
    {
        callback(null, null);
        return;
    }
    else if(rows.length > 1)
    {
        err = "More than one user found";
        console.error(err);
        callback(null, null);
        return;
    }
    else
    {
        result = this.userFromRow(rows[0]);
        callback(null, result);
    }
}

User.userFromRow = function(row)
{
    var user = new User();
    user.username = row.username;
    user.authenticator = row.authenticator;
    user.dataset = row.dataset;
    user.isAdmin = row.isAdmin;
    return user;
}

module.exports = User;
