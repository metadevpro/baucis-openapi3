// __Dependencies__
var path = require('path');
var baucis = require('baucis');
var deco = require('deco');
var optionsBuilder = require('./src/OptionsBuilder');

var decorators = deco.require(path.join(__dirname, 'src'), 
                              [ 'Controller', 'Api' ]).hash;

baucis.Controller.decorators(decorators.Controller);
baucis.Api.decorators(decorators.Api);

module.exports = optionsBuilder;