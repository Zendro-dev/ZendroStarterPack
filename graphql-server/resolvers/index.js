const fs = require('fs');

let resolvers = {};

module.exports = resolvers;

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        const resolversModel = require('./' + file);
        for (resolver in resolversModel) {
            resolvers[resolver] = resolversModel[resolver];
        }
    });