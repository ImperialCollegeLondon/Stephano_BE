var vows = require('vows'),
    assert = require('assert'),
    suite = vows.describe('User Object functions'),
    User = require('../interfaces/User.js').User,
    Authenticator = require('../interfaces/User.js').Authenticator,
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
            'deletes the user' : function(result, err)
            {
                console.log(err);
                assert.ifError(err);

            }
        },
        'Testing a password' : {
            topic : function()
            {
                var password = 'password12345~&',
                    salt = 'aa123345677890',
                    algorithm = 'aes256',
                    authenticator = new Authenticator();

                    authenticator.setPassword(password, algorithm,  salt);

                    return {authenticator: authenticator, password: password, salt : salt, algorithm : algorithm };
            },
            'check password recovered is the same as the one set' : function(obj)
            {
                assert.equal(obj.authenticator.getPassword(obj.algorithm, obj.salt), obj.password);
            }
        }
}).export(module);
