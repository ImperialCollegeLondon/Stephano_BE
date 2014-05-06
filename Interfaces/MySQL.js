var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    driver = require('mysql');

var MySQL = function(config){
    this.config = config;
}

util.inherits(MySQL, EventEmitter);

MySQL.prototype.findObject = function(cls, criteria, callback)
{
    var fields = this.getFieldsFromClass(cls),
        table = cls.name;

    this.select(fields, table, criteria, callback);
};

MySQL.prototype.select = function(fields, table, criteria, callback)
{
    var qry = "SELECT ?? FROM ?? WHERE ?",
        con = driver.createConnection(this.config);

    con.query(qry, [fields, table, (criteria || true)], callback);
};

MySQL.prototype.connectCallback = function(err)
{
    if(err) {
        this.emit('connect_error', err);
    }
};

MySQL.prototype.getFieldsFromClass = function(cls)
{
    var obj = new cls(),
        field_arr = [];

    for( var key in  obj)
    {
        if(typeof obj[key] != 'function')
        {
            field_arr.push(key);
        }
    }

    return field_arr;
};

module.exports = MySQL;
