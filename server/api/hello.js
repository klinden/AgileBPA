'use strict';

module.exports = {
    handler: function(request, reply) {
        reply({ 'api' : 'hello ' + request.auth.credentials.firstName + ' ' + request.auth.credentials.lastName + "!" });
    },
    auth: {
        strategy: 'bearer'
    }
};
