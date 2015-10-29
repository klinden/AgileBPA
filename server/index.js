'use strict';

// new relic monitoring
require('newrelic');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config');

// Mongoose
var mongoose = require('mongoose');
mongoose.connect(config.mongoConnectionString);

// Hapi
var Hapi = require('hapi');
var server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});
server.connection({ port: config.port });

// require https in production
if(config.env === 'production')
    server.register(require('hapi-require-https').register, function(err) { if(err) console.log('failed to load hapi-require-https'); });

server.register(require('hapi-auth-bearer-simple'), function(err) {
    if(err) throw err;

    server.auth.strategy('bearer', 'bearerAuth', {
       validateFunction: function(token, callback) {
           var userModel = require('./models/user');
           userModel.findOne({ 'token' : token }, function(err, userDoc) {
               if(userDoc)
               {
                   callback(null, true, {
                       id: userDoc.id,
                       firstName: userDoc.firstName,
                       lastName: userDoc.lastName,
                       email: userDoc.email
                   });
               }
               else
               {
                   callback(null, false, null);
               }
           });
       }
    });
});

server.route(require('./routes'));

server.start(function() {
    console.log('Node/Hapi running on port ' + server.info.port);
});

