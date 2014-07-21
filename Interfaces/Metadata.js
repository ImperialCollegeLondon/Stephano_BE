
var DBDriver = require('./MySQL.js'),
    geojson = require('geojson');
    Metadata = function(config)
{
    this.fields = config.metaFields;
    this.table_name = config.strainTable.name;
    this.latitude_field = config.strainTable.latitude_field;
    this.longitude_field = config.strainTable.longitude_field;
    this.id_field = config.strainTable.idField;

    this.db = new DBDriver(config.connection);
}

Metadata.prototype.getGeoJson = function(callback)
{
    this.db.select([this.id_field, this.latitude_field, this.longitude_field], this.table_name, null, function(err, rows)
    {
        geojson.parse(rows, {Point: [this.latitude_field, this.longitude_field], id: this.id_field}, callback);
    }.bind(this));

}

Metadata.prototype.getTable = function(callback)
{
    var fields = [this.id_field];

    for( var i = 0; i < this.fields.length; i++ )
    {
        fields.push(this.fields[i].name);
    }

    this.db.select(fields, this.table_name, null, callback);
}

Metadata.prototype.getGroupings = function(field, callback)
{
    var fields = [this.id_field, field],
        idField = this.id_field;


    this.db.select(fields, this.table_name, null, function(err, rows){
        //check for an error
        if(err){ callback(err, null); return; }

        var data = {},
            vals = [];

        for( var i = 0; i < rows.length; i++ )
        {
            var val = rows[i][field];
            if(!data[val])
            {
                data[val] = [];
                vals.push(val);
            }

            data[val].push(rows[i][idField]);
        }

        data.vals = vals;
        callback(err, data);
    });
}
module.exports = Metadata;
