var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    driver = require('mysql');

var MySQL = function(config){
    this.config = config;

    //this.connection = driver.createConnection(config);
    //this.connection.connect(this.connectCallback);
}

util.inherits(MySQL, EventEmitter);

MySQL.prototype.findObject = function(cls, criteria, callback)
{
    var qry = "SELECT ?? FROM ?? WHERE ?",
        fields = this.getFieldsFromClass(cls),
        table = cls.name,
        con = driver.createConnection(this.config);

    con.query(qry, [fields, table, criteria], callback);
};

MySQL.prototype.connectCallback = function(err)
{
    if(err) {
        this.emit('connect_error', err);
    }
}

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
}

MySQL.prototype.getCriteriaString = function(obj)
{
    var tuples = [];

    for ( var key in obj )
    {
        tuples.push(util.format('%s = %s', driver.escapeId(key), driver.escape(obj[key])));
    }

    return tuples.join(' AND ');
}

module.exports = MySQL;
