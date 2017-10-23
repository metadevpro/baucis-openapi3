// __Dependencies__
var mongoose = require('mongoose');
var express = require('express');
var async = require('async');
var baucis = require('baucis');
var config = require('./config');
var plugin = require('../..');

// __Private Module Members__
var app = null;
var server = null;
var Schema = mongoose.Schema;
var Vegetable = new Schema({
  name: {
    type: String,
    required: true
  },
  diseases: {
    type: [String],
    select: false
  },
  species: {
    type: String,
    default: 'n/a',
    select: false
  },
  related: {
    type: Schema.ObjectId,
    ref: 'vegetable'
  }
});
var Fungus = new Schema({
  dork: {
    type: Boolean,
    default: true
  },
  'hyphenated-field-name': {
    type: String,
    default: 'blee'
  },
  password: {
    type: String,
    default: '123'
  }
});
var Stuffing = new Schema({
  bread: {
    type: Boolean,
    default: true
  }
});
var Goose = new Schema({
  cooked: {
    type: Boolean,
    default: true
  },
  stuffed: [Stuffing]
});

var ChargeArea = new Schema({
  name: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: false
  },
  orders: {
    type: [Number],
    required: false
  },
  clusters: [{
    type: Schema.Types.ObjectId,
    ref: 'ChargeCluster'
  }]
});
var ChargeCluster = new Schema({
  name: {
    type: String,
    required: true
  }
});

mongoose.Promise = global.Promise;

mongoose.model('vegetable', Vegetable);
mongoose.model('fungus', Fungus).plural('fungi');
mongoose.model('goose', Goose).plural('geese');

mongoose.model('chargeCluster', ChargeCluster);
mongoose.model('chargeArea', ChargeArea);

// __Module Definition__
var fixture = module.exports = {
  init: function (done) {
    mongoose.connect(config.mongo.url, {
      useMongoClient: true 
    });

    var serverVars = plugin
      .buildServerVariables()
      .addServerVar("user", ["demo", "joe", "alicia"], "alicia", "User name for authentication.")
      .addServerVar("env", ["dev", "qa", "prod"], "qa", "Development to test.");

    //Customize OpenAPI contract ----
    var openApiCustomizations =
      plugin.buildOptions()
      .title("my app")
      .version("3.14.15")
      .description("OpenAPI 3.0.0-RC implementors sample doc.")
      .contact("Pedro J. Molina", "http://pjmolina.com", "pjmolina@acme.com")
      .addServer("http://api1.acme.com", "My prod server", serverVars)
      .addServer("http://api2.acme.com/qa", "My QA server", serverVars)
      .addSecuritySchemeBasicAuth("authentication_basic")
      .addSecurityJWT("autentication_jwt")
      .addSecuritySchemeApiKey("authentication_apikey")
      .license("Apache 2", "http://apache.org")
      .termsOfService("My TOS");

    fixture.controller = baucis.rest('vegetable')
                               .hints(true)
                               .comments(true);
    fixture.controller.generateOpenApi3();

    //forbiden extension
    fixture.controller.openApi3.lambic = 'kriek';
    //allowed on extensions points for controllers (paths & defintions)
    fixture.controller.openApi3.paths['/starkTrek'] = {
      get: {
        operationId: 'enterprise',
        responses: {
          "200": {
            "description": "Sucessful response.",
            "schema": {
              "$ref": "#/components/schemas/Vegetable"
            }
          }
        }
      }
    };
    fixture.controller.openApi3.components.schemas.Spook = {};

    baucis.rest('fungus').select('-hyphenated-field-name -password');
    baucis.rest('goose');
    baucis.rest('chargeArea');
    baucis.rest('chargeCluster');

    app = express();

    var baucisInstance = baucis();

    //extend root document for OpenApi 3 (neeeds access to baucisInstance to access api extensibility)
    baucisInstance.generateOpenApi3(openApiCustomizations);
    baucisInstance.openApi3Document['x-powered-by'] = 'baucis';

    baucisInstance.openApi3Document.components.schemas.customDefinition = {
      properties: {
        a: {
          type: "string"
        }
      }
    };

    app.use('/api', baucisInstance);

    app.use(function (error, request, response, next) {
      if (error) { return response.status(500).send(error.toString()); }
      next();
    });

    server = app.listen(8012);
    done();
  },
  deinit: function (done) {
    server.close();
    mongoose.disconnect();
    done();
  },
  create: function (done) {
    var Vegetable = mongoose.model('vegetable');
    var vegetableNames = ['Turnip', 'Spinach', 'Pea', 'Shitake', 'Lima Bean', 'Carrot', 'Zucchini', 'Radicchio'];
    var vegetables = vegetableNames.map(function (name) {
      return new Vegetable({
        name: name
      });
    });
    var deferred = [
      Vegetable.remove.bind(Vegetable)
    ];

    deferred = deferred.concat(vegetables.map(function (vegetable) {
      return vegetable.save.bind(vegetable);
    }));

    async.series(deferred, done);
  }
};