var vows = require('vows'),
    assert = require('assert'),
    suite = vows.describe('User Object functions'),
    User = require('../interfaces/User.js').User,
    DBDriver = require('../interfaces/MySQL.js'),
    configuration = require('../config.json');

suite.addBatch({
        'when adding a user' : {
            topic : function()
            {

                var db = new DBDriver(configuration.connection);

                var user = new User();
                user.firstName = 'Test';
                user.lastName = 'Test';
                user.email = 'test@test.com';
                user.add(db, this.callback);

            },
            'saves the user to the database' : function(err, result)
            {
                if( typeof err == 'object' )
                {
                    assert.equal(err.type, 'DUPLICATE');
                } else if(err) {
                    assert.ifError(err);
                }
            }
        },
        'when finding a user' : {
            topic : function()
            {

                var db = new DBDriver(configuration.connection);
                User.findOne('test@test.com', db, this.callback);

            },
            'finds the correct user' : function(err, result)
            {
                assert.ifError(err);
            }
        },
        'when deleting a user' : {
            topic : function()
            {

                var db = new DBDriver(configuration.connection);

                var user = new User();
                user.email = 'test@test.com';
                user.delete(db, this.callback);
            },
            'deletes the user' : function(err, result)
            {
                assert.ifError(err);

            }
        }
}).export(module);
