var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    driver = require('mysql');

var MySQL = function(config){
    this.config = config;
    this.connection = driver.createPool(this.config);
}

MySQL.prototype.findObject = function(cls, criteria, callback)
{
    var fields = this.getFieldsFromClass(cls),
        table = cls.name;

    this.select(fields, table, criteria, callback);
};

MySQL.prototype.deleteObject = function(cls, criteria, callback)
{
    var fields = this.getFieldsFromClass(cls),
        table = cls.name;

    this.delete(table, criteria, function(res, err){
        callback(err);
    });
};

MySQL.prototype.addObject = function(cls, object, callback)
{
    var fields = this.getFieldsFromClass(cls),
        table = cls.name,
        values = [];

    for( var field_index = 0; field_index < fields.length; field_index ++ )
    {
        field = fields[field_index];
        if(object[field] !== '' || object[field] !== undefined)
        {
            values.push(object[field]);
        }
        else
        {
            fields = fields.splice(field_index,1);
            field_index--;
        }
    }

    this.insert(fields, table, values, function(err, result){
        if(err.code == 'ER_DUP_ENTRY')
        {
            err = { type : 'DUPLICATE' }
        }
        callback(err, result)
    });
}

MySQL.prototype.select = function(fields, table, criteria, callback)
{
    var qry = "SELECT ?? FROM ?? WHERE ?";
    this.connection.query(qry, [fields, table, (criteria || true)], callback);
};

MySQL.prototype.insert = function(fields, table, values, callback)
{
    var qry = "INSERT INTO ?? (??) VALUES (?)";
    this.connection.query(qry, [table, fields,  values], callback);
};

MySQL.prototype.update = function(fields, table, criteria, callback)
{
    var qry = "UPDATE ?? SET ? WHERE ?";
    this.connection.query(qry, [table, fields, criteria], callback);
};

MySQL.prototype.delete = function(table, criteria, callback)
{
    var qry = "DELETE FROM ?? WHERE ?";
    this.connection.query(qry, [table, criteria], callback);
};

MySQL.prototype.connectCallback = function(err)
{
    if(err) {
        throw (err);
    }
};

MySQL.prototype.getFieldsFromClass = function(cls)
{
    var obj = new cls(),
        field_arr = [];

    for( var key in  obj)
    {
        if(typeof obj[key] != 'function' && typeof obj[key] != 'object')
        {
            field_arr.push(key);
        }
    }

    return field_arr;
};

MySQL.prototype.disconnect = function()
{
    this.connection.end();
}

module.exports = MySQL;
