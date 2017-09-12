var expect = require('expect.js');
var request = require('request');
var fs = require('fs');

var fixtures = require('./fixtures');
var contractUrl = 'http://127.0.0.1:8012/api/openapi.json';

function getItemFromArray(array, selector, value) {
  for (var item in array) {
    if (array[item][selector] === value) {
      return array[item];
    }
  }
  return null;
}

describe('OpenAPI 3.0 Resources', function () {
  before(fixtures.vegetable.init);
  beforeEach(fixtures.vegetable.create);
  after(fixtures.vegetable.deinit);

  describe('contract url', function () {
    it('should be exposed on: openapi.json', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.have.property('openapi', '3.0.0');
        done();
      });
    });
    it('save sample contract to disk', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.have.property('openapi', '3.0.0');

        fs.writeFile("test/reference-contract.json", 
                     JSON.stringify(body, null, 2), function(err) {
          if (err) { done(err); }
          done();
        });
      });
    });
  });

  describe('header info', function () {
    it('should generate the correct header', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.have.property('openapi', '3.0.0');
        expect(body).to.have.property('x-powered-by', 'baucis');

        expect(body).to.have.property('info');
        expect(body.info).to.have.property('title', 'my app');

        expect(body).to.have.property('paths');
        expect(body).to.have.property('components');

        // Check the API listing
        var paths = body.paths;
        expect(paths).to.be.an(Object);
        expect(body.components).to.be.an(Object);
        expect(body.components.schemas).to.be.an(Object);

        var pathInstance0 = body.paths['/vegetables/{id}'];
        expect(pathInstance0).to.be.an(Object);

        expect(pathInstance0.get).to.be.an(Object);
        expect(pathInstance0.put).to.be.an(Object);
        expect(pathInstance0.delete).to.be.an(Object);

        expect(pathInstance0.get.tags).to.be.an(Array);
        expect(pathInstance0.get.operationId).to.be('getVegetableById');
        expect(pathInstance0.get.summary).to.be('Get a vegetable by its unique ID');
        expect(pathInstance0.get.description).to.be('Retrieve a vegetable by its ID.');
        expect(pathInstance0.get.parameters).to.be(undefined);
        expect(pathInstance0.get.responses).to.be.an(Object);
        expect(pathInstance0.get.security).to.be(undefined);

        expect(pathInstance0.put.operationId).to.be('updateVegetable');
        expect(pathInstance0.put.summary).to.be('Modify a vegetable by its unique ID');
        expect(pathInstance0.put.description).to.be('Update an existing vegetable by its ID.');

        expect(pathInstance0.delete.operationId).to.be('deleteVegetableById');
        expect(pathInstance0.delete.summary).to.be('Delete a vegetable by its unique ID');
        expect(pathInstance0.delete.description).to.be('Deletes an existing vegetable by its ID.');

        var pathCollection0 = body.paths['/vegetables'];
        expect(pathCollection0).to.be.an(Object);

        expect(pathCollection0.get).to.be.an(Object);
        expect(pathCollection0.post).to.be.an(Object);
        expect(pathCollection0.delete).to.be.an(Object);

        expect(pathCollection0.get.tags).to.be.an(Array);
        expect(pathCollection0.get.operationId).to.be('queryVegetable');
        expect(pathCollection0.get.summary).to.be('Query some vegetables');
        expect(pathCollection0.get.description).to.be('Query over vegetables.');
        expect(pathCollection0.get.parameters).to.be.an(Array);
        expect(pathCollection0.get.responses).to.be.an(Object);
        expect(pathCollection0.get.security).to.be(undefined);

        expect(pathCollection0.post.operationId).to.be('createVegetable');
        expect(pathCollection0.post.summary).to.be('Create some vegetables');
        expect(pathCollection0.post.description).to.be('Create one or more vegetables.');

        expect(pathCollection0.delete.operationId).to.be('deleteVegetableByQuery');
        expect(pathCollection0.delete.summary).to.be('Delete some vegetables by query');
        expect(pathCollection0.delete.description).to.be('Delete all vegetables matching the specified query.');

        done();
      });
    });

    it('should generate no security info (to be added by customization)', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.have.property('openapi', '3.0.0');
        expect(body.security).to.be(undefined);
        done();
      });
    });
  });

  describe('paths', function () {

    it('should generate the correct GET /vegetables operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathCollection0 = body.paths['/vegetables'];
        expect(pathCollection0).to.be.an(Object);

        expect(pathCollection0.get).to.be.an(Object);
        expect(pathCollection0.get.tags).to.be.an(Array);
        expect(pathCollection0.get.operationId).to.be('queryVegetable');
        expect(pathCollection0.get.summary).to.be('Query some vegetables');
        expect(pathCollection0.get.description).to.be('Query over vegetables.');
        expect(pathCollection0.get.parameters).to.be.an(Array);
        expect(pathCollection0.get.responses).to.be.an(Object);
        expect(pathCollection0.get.security).to.be(undefined);

        done();
      });
    });

    it('should generate the correct POST /vegetables operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathCollection0 = body.paths['/vegetables'];
        expect(pathCollection0).to.be.an(Object);
        expect(pathCollection0.post).to.be.an(Object);
        expect(pathCollection0.post.operationId).to.be('createVegetable');
        expect(pathCollection0.post.summary).to.be('Create some vegetables');
        expect(pathCollection0.post.description).to.be('Create one or more vegetables.');

        done();
      });
    });

    it('should generate unique names per operationId', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathCollection0 = body.paths['/vegetables'];
        expect(pathCollection0.post.operationId).to.be('createVegetable');
        expect(pathCollection0.delete.operationId).to.be('deleteVegetableByQuery');
        expect(pathCollection0.get.operationId).to.be('queryVegetable');

        var pathInstance0 = body.paths['/vegetables/{id}'];
        expect(pathInstance0.put.operationId).to.be('updateVegetable');
        expect(pathInstance0.delete.operationId).to.be('deleteVegetableById');
        expect(pathInstance0.get.operationId).to.be('getVegetableById');


        done();
      });
    });


    it('should generate the correct DELETE /vegetables operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathCollection0 = body.paths['/vegetables'];
        expect(pathCollection0).to.be.an(Object);

        expect(pathCollection0.delete).to.be.an(Object);
        expect(pathCollection0.delete.operationId).to.be('deleteVegetableByQuery');
        expect(pathCollection0.delete.summary).to.be('Delete some vegetables by query');
        expect(pathCollection0.delete.description).to.be('Delete all vegetables matching the specified query.');

        done();
      });
    });

    it('should generate the correct GET /vegetables/{id} operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathInstance0 = body.paths['/vegetables/{id}'];
        expect(pathInstance0).to.be.an(Object);

        expect(pathInstance0.get).to.be.an(Object);

        expect(pathInstance0.get.tags).to.be.an(Array);
        expect(pathInstance0.get.operationId).to.be('getVegetableById');
        expect(pathInstance0.get.summary).to.be('Get a vegetable by its unique ID');
        expect(pathInstance0.get.description).to.be('Retrieve a vegetable by its ID.');
        expect(pathInstance0.get.parameters).to.be(undefined);
        expect(pathInstance0.get.responses).to.be.an(Object);
        expect(pathInstance0.get.security).to.be(undefined);

        done();
      });
    });

    it('should generate the correct PUT /vegetables/{id} operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathInstance0 = body.paths['/vegetables/{id}'];
        expect(pathInstance0).to.be.an(Object);

        expect(pathInstance0.put).to.be.an(Object);

        expect(pathInstance0.put.operationId).to.be('updateVegetable');
        expect(pathInstance0.put.summary).to.be('Modify a vegetable by its unique ID');
        expect(pathInstance0.put.description).to.be('Update an existing vegetable by its ID.');

        done();
      });
    });
    it('should generate the correct DELETE /vegetables/{id} operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var pathInstance0 = body.paths['/vegetables/{id}'];
        expect(pathInstance0).to.be.an(Object);

        expect(pathInstance0.delete.operationId).to.be('deleteVegetableById');
        expect(pathInstance0.delete.summary).to.be('Delete a vegetable by its unique ID');
        expect(pathInstance0.delete.description).to.be('Deletes an existing vegetable by its ID.');

        done();
      });
    });
  });

  describe('models', function () {

    it('should generate the correct schema definitions', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas.Vegetable).to.be.an(Object);
        expect(body.components.schemas.Vegetable.required.length).to.be(1);
        expect(body.components.schemas.Vegetable.required[0]).to.be('name');
        expect(body.components.schemas.Vegetable.properties.name.type).to.be('string');
        expect(body.components.schemas.Vegetable.properties.related.$ref).to.be('#/components/schemas/Vegetable');
        expect(body.components.schemas.Vegetable.properties._id.type).to.be('string');
        expect(body.components.schemas.Vegetable.properties.__v.type).to.be('number');
        expect(body.components.schemas.Vegetable.properties.__v.format).to.be('int32');
        expect(body.components.schemas.Vegetable.properties.id.type).to.be('string');
        expect(Object.keys(body.components.schemas.Vegetable.properties).length).to.be(5);

        expect(body.components.schemas.Fungus).to.be.an(Object);
        expect(body.components.schemas.Fungus.required).to.be(undefined);
        expect(body.components.schemas.Fungus.properties.dork.type).to.be('boolean');
        expect(body.components.schemas.Fungus.properties._id.type).to.be('string');
        expect(body.components.schemas.Fungus.properties.__v.type).to.be('number');
        expect(body.components.schemas.Fungus.properties.__v.format).to.be('int32');
        expect(body.components.schemas.Fungus.properties.id.type).to.be('string');
        expect(Object.keys(body.components.schemas.Fungus.properties).length).to.be(4);

        expect(body.components.schemas.Goose).to.be.an(Object);
        expect(body.components.schemas.Goose.required).to.be(undefined);
        expect(body.components.schemas.Goose.properties.cooked.type).to.be('boolean');
        expect(body.components.schemas.Goose.properties.stuffed.type).to.be('array');
        expect(body.components.schemas.Goose.properties.stuffed.items.$ref).to.be('#/components/schemas/GooseStuffed');
        expect(body.components.schemas.Goose.properties._id.type).to.be('string');
        expect(body.components.schemas.Goose.properties.__v.type).to.be('number');
        expect(body.components.schemas.Goose.properties.__v.format).to.be('int32');
        expect(body.components.schemas.Goose.properties.id.type).to.be('string');
        expect(Object.keys(body.components.schemas.Goose.properties).length).to.be(5);

        expect(body.components.schemas.GooseStuffed).to.be.an(Object);
        expect(body.components.schemas.GooseStuffed.required).to.be(undefined);
        expect(body.components.schemas.GooseStuffed.properties.bread.type).to.be('boolean');
        expect(body.components.schemas.GooseStuffed.properties._id.type).to.be('string');
        expect(body.components.schemas.GooseStuffed.properties.id.type).to.be('string');
        expect(Object.keys(body.components.schemas.GooseStuffed.properties).length).to.be(3);

        expect(body.components.schemas.ValidationError).to.be.an(Object);
        expect(body.components.schemas.ValidationError.required.length).to.be(4);
        expect(body.components.schemas.ValidationError.required[0]).to.be('message');
        expect(body.components.schemas.ValidationError.required[1]).to.be('name');
        expect(body.components.schemas.ValidationError.required[2]).to.be('kind');
        expect(body.components.schemas.ValidationError.required[3]).to.be('path');
        expect(Object.keys(body.components.schemas.ValidationError.properties).length).to.be(5);
        expect(body.components.schemas.ValidationError.properties.properties.$ref).to.be('#/components/schemas/ValidationErrorProperties');
        expect(body.components.schemas.ValidationError.properties.message.type).to.be('string');
        expect(body.components.schemas.ValidationError.properties.kind.type).to.be('string');
        expect(body.components.schemas.ValidationError.properties.path.type).to.be('string');

        expect(body.components.schemas.ValidationErrorProperties).to.be.an(Object);
        expect(body.components.schemas.ValidationErrorProperties.required.length).to.be(3);
        expect(body.components.schemas.ValidationErrorProperties.required[0]).to.be('type');
        expect(body.components.schemas.ValidationErrorProperties.required[1]).to.be('message');
        expect(body.components.schemas.ValidationErrorProperties.required[2]).to.be('path');
        expect(Object.keys(body.components.schemas.ValidationErrorProperties.properties).length).to.be(3);
        expect(body.components.schemas.ValidationErrorProperties.properties.type.type).to.be('string');
        expect(body.components.schemas.ValidationErrorProperties.properties.message.type).to.be('string');
        expect(body.components.schemas.ValidationErrorProperties.properties.path.type).to.be('string');

        done();
      });
    });

    it('should generate embedded models correctly', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas).to.have.property('Goose');
        expect(body.components.schemas).to.have.property('GooseStuffed');
        expect(body.components.schemas.Goose.properties).to.have.property('stuffed');
        expect(body.components.schemas.Goose.properties.stuffed.type).to.be('array');
        expect(body.components.schemas.Goose.properties.stuffed.items.$ref).to.be('#/components/schemas/GooseStuffed');

        done();
      });
    });

  });

  describe('extensibility', function () {

    it("should copy all properties from the controller's openApi3 object", function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }
        expect(response).to.have.property('statusCode', 200);

        //forbidden extension
        expect(body).to.not.have.property('lambic');

        //allowed extensions
        expect(body.paths['/starkTrek']).to.be.an(Object);
        expect(body.paths['/starkTrek'].get.operationId).to.be('enterprise');
        expect(body.components.schemas.Spook).to.be.an(Object);

        done();
      });
    });

    it("should see overrided OpenAPI definitions", function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(body).to.have.property('x-powered-by', 'baucis');
        done();
      });
    });

    xit('should allow adding custom APIs dynamically (not supported yet)', function (done) {
      fixtures.vegetable.controller.openApi3.paths['/vegetables/best'] = {
        'get': {
          'operationId': 'getBestVegetable',
          'summary': 'Get the best vegetable'
        }
      };
      fixtures.vegetable.controller.openApi3.components.schemas.BestVegetable = {
        required: [],
        properties: {
          "name": {
            "type": "string"
          }
        }
      };

      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(response).to.have.property('statusCode', 200);
        expect(body.paths).to.have.property('/vegetables/best');
        expect(body.components.schemas).to.have.property('BestVegetable');

        done();
      });
    });

    it('should preserve extended root definitions', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        expect(body.components.schemas).to.have.property('customDefinition');
        expect(body.components.schemas.customDefinition).to.have.property('properties');
        expect(body.components.schemas.customDefinition.properties).to.have.property('a');

        done();
      });
    });
  });

  describe('requestBodies', function () {
    it('should generate the correct requesBody in put operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }
        var rBody = body.paths['/vegetables/{id}'].put.requestBody;

        expect(rBody).to.have.property('content');
        expect(rBody).to.have.property('description');
        expect(rBody.content).to.have.property('application/json');
        expect(rBody.content['application/json']).to.have.property('schema');
        expect(rBody.content['application/json'].schema.$ref)
            .to.be('#/components/schemas/Vegetable');
        
        done(); 
      });
    });
  });

  describe('responses', function () {

    it('should generate the correct error responses', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        var instanceResponses = body.paths['/vegetables/{id}'].get.responses;
        expect(instanceResponses['404'].description).to.be('No vegetable was found with that ID.');
        
        expect(instanceResponses['404'].content['application/json'].schema.type).to.be('string');
        expect(instanceResponses['200'].description).to.be('Sucessful response. Single resource.');
        expect(instanceResponses['200'].content['application/json'].schema.$ref).to.be('#/components/schemas/Vegetable');
        expect(instanceResponses.default.description).to.be('Unexpected error.');
        expect(instanceResponses.default.content['application/json'].schema.type).to.be('string');
        expect(Object.keys(instanceResponses).length).to.be(3);

        var collectionResponses = body.paths['/vegetables'].post.responses;
        expect(collectionResponses['404'].description).to.be('No vegetables matched that query.');
        expect(collectionResponses['404'].content['application/json'].schema.type).to.be('string');
        expect(collectionResponses['422'].description).to.be('Validation error.');
        expect(collectionResponses['422'].content['application/json'].schema.type).to.be('array');
        expect(collectionResponses['422'].content['application/json'].schema.items.$ref).to.be('#/components/schemas/ValidationError');
        expect(collectionResponses['200'].description).to.be('Sucessful response. Single resource.');
        expect(collectionResponses['200'].content['application/json'].schema.$ref).to.be('#/components/schemas/Vegetable');
        expect(collectionResponses.default.description).to.be('Unexpected error.');
        expect(collectionResponses.default.content['application/json'].schema.type).to.be('string');
        expect(Object.keys(collectionResponses).length).to.be(4);

        done();
      });
    });

    it('post operation exposes 422 error for validation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        var operation = body.paths['/vegetables'].post;

        expect(operation).to.be.an(Object);
        expect(operation.responses).to.have.property('422');
        expect(operation.responses['422']).to.have.property('description', 'Validation error.');
        expect(operation.responses['422'].content['application/json'].schema.type).to.be('array');
        expect(operation.responses['422'].content['application/json'].schema.items.$ref).to.be('#/components/schemas/ValidationError');

        done();
      });
    });

    it('put operation exposes 422 error for validation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        var operation = body.paths['/vegetables/{id}'].put;

        expect(operation).to.be.an(Object);
        expect(operation.responses).to.have.property('422');
        expect(operation.responses['422']).to.have.property('description', 'Validation error.');
        expect(operation.responses['422'].content['application/json'].schema.type).to.be('array');
        expect(operation.responses['422'].content['application/json'].schema.items.$ref).to.be('#/components/schemas/ValidationError');

        done();
      });
    });

  });

  describe('keep private data hidden', function () {

    it('should correctly set paths as private even if the path name contains hyphens', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);
        expect(body.components.schemas).to.have.property('Fungus');
        expect(body.components.schemas.Fungus.properties).to.not.have.property('hyphenated-field-name');
        expect(body.components.schemas.Fungus.properties).to.not.have.property('password');
        expect(body.components.schemas.Fungus.properties).to.have.property('dork');
        done();
      });
    });

    it('should keep paths deselected in the schema private', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas).to.have.property('Vegetable');
        expect(body.components.schemas.Vegetable.properties).to.not.have.property('diseases');
        expect(body.components.schemas.Vegetable.properties).to.not.have.property('species');

        done();
      });
    });

    it('should keep paths deselected in the controller private', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas).to.have.property('Fungus');
        expect(body.components.schemas.Fungus.properties).to.not.have.property('hyphenated-field-name');
        expect(body.components.schemas.Fungus.properties).to.not.have.property('password');

        done();
      });
    });

  });

  describe('parameters definition', function() {

    it('param skip is generated', function(done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(body.components.parameters).to.be.an(Object);
        var param = body.components.parameters.skip;
        expect(param).to.have.property('name', 'skip');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'How many documents to skip. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#skip)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'integer');
        expect(param.schema).to.have.property('format', 'int32');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param limit is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.limit;
        expect(param).to.have.property('name', 'limit');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'The maximum number of documents to send. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#limit)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'integer');
        expect(param.schema).to.have.property('format', 'int32');
        expect(param).to.have.property('required', false);

        done();
      });
    });
    it('param count is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.count;
        expect(param).to.have.property('name', 'count');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Set to true to return count instead of documents. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#count)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'boolean');
        expect(param).to.have.property('required', false);

        done();
      });
    });
    it('param conditions is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.conditions;
        expect(param).to.have.property('name', 'conditions');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Set the conditions used to find or remove the document(s). [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#conditions)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param sort is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.sort;

        expect(param).to.have.property('name', 'sort');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Set the fields by which to sort. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#sort)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param select is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.select;

        expect(param).to.have.property('name', 'select');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Select which paths will be returned by the query. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#select)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param populate is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.populate;

        expect(param).to.have.property('name', 'populate');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Specify which paths to populate. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#populate)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });
    it('param distinct is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.distinct;

        expect(param).to.have.property('name', 'distinct');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Set to a path name to retrieve an array of distinct values. [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#distinct)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param hint is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.hint;

        expect(param).to.have.property('name', 'hint');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Add an index hint to the query (must be enabled per controller). [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#hint)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param comment is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.comment;

        expect(param).to.have.property('name', 'comment');
        expect(param).to.have.property('in', 'query');
        expect(param).to.have.property('description', 'Add a comment to a query (must be enabled per controller). [doc](https://github.com/wprl/baucis/wiki/Query-String-Parameters#comment)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

    it('param id is generated', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters.id;

        expect(param).to.have.property('name', 'id');
        expect(param).to.have.property('in', 'path');
        expect(param).to.have.property('description', 'The identifier of the resource.');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', true);

        done();
      });
    });

    it('param X-Baucis-Update-Operator is generated on put operation', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = body.components.parameters['X-Baucis-Update-Operator'];
        expect(param).to.have.property('name', 'X-Baucis-Update-Operator');
        expect(param).to.have.property('in', 'header');
        expect(param).to.have.property('description', '**BYPASSES VALIDATION** May be used with PUT to update the document using $push, $pull, or $set. [doc](https://github.com/wprl/baucis/wiki/HTTP-Headers)');
        expect(param).to.not.have.property('type'); //v2
        expect(param).to.have.property('schema');
        expect(param.schema).to.have.property('type', 'string');
        expect(param).to.have.property('required', false);

        done();
      });
    });

  });

  describe('parameters usage', function() {

    it('param skip is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(body.paths['/vegetables'].get.parameters).to.be.an(Array);
        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/skip');
        expect(param).to.have.property('$ref', '#/components/parameters/skip');

        done();
      });
    });
    it('param limit is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/limit');
        expect(param).to.have.property('$ref', '#/components/parameters/limit');

        done();
      });
    });
    it('param count is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/count');
        expect(param).to.have.property('$ref', '#/components/parameters/count');

        done();
      });
    });
    it('param conditions is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/conditions');
        expect(param).to.have.property('$ref', '#/components/parameters/conditions');

        done();
      });
    });
    it('param sort is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].parameters, '$ref', '#/components/parameters/sort');
        expect(param).to.have.property('$ref', '#/components/parameters/sort');

        done();
      });
    });
    it('param select is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].parameters, '$ref', '#/components/parameters/select');
        expect(param).to.have.property('$ref', '#/components/parameters/select');

        done();
      });
    });
    it('param populate is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].parameters, '$ref', '#/components/parameters/populate');
        expect(param).to.have.property('$ref', '#/components/parameters/populate');

        done();
      });
    });
    it('param distinct is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/distinct');
        expect(param).to.have.property('$ref', '#/components/parameters/distinct');

        done();
      });
    });
    it('param hint is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/hint');
        expect(param).to.have.property('$ref', '#/components/parameters/hint');

        done();
      });
    });
    it('param comment is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables'].get.parameters, '$ref', '#/components/parameters/comment');
        expect(param).to.have.property('$ref', '#/components/parameters/comment');

        done();
      });
    });

    it('param id is referenced', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        var param = getItemFromArray(body.paths['/vegetables/{id}'].parameters, '$ref', '#/components/parameters/id');
        expect(param).to.have.property('$ref', '#/components/parameters/id');

        done();
      });
    });

  });

  describe('tags', function () {

    it('tags are declared', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.tags).to.be.an(Array);
        expect(body.tags[0]).to.have.property('name', 'vegetable');
        expect(body.tags[0]).to.have.property('x-resource', true);
        expect(body.tags[1]).to.have.property('name', 'fungus');
        expect(body.tags[1]).to.have.property('x-resource', true);
        expect(body.tags[2]).to.have.property('name', 'goose');
        expect(body.tags[2]).to.have.property('x-resource', true);

        done();
      });
    });

    it('tags labels operations operations', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.paths['/vegetables'].get.tags).to.be.an(Array);
        expect(body.paths['/vegetables'].get.tags[0]).to.be('vegetable'); //resource

        done();
      });
    });

  });

  describe('arrays', function () {
    it('recognizes Mongo array type', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas).to.have.property('Goose');
        expect(body.components.schemas).to.have.property('GooseStuffed');
        expect(body.components.schemas.Goose.properties).to.have.property('stuffed');
        expect(body.components.schemas.Goose.properties.stuffed.type).to.be('array');
        expect(body.components.schemas.Goose.properties.stuffed.items).to.have.property('$ref');
        expect(body.components.schemas.Goose.properties.stuffed.items.$ref).to.be('#/components/schemas/GooseStuffed');

        done();
      });
    });

    it('recognizes array of literals - string', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(body.components.schemas.ChargeArea.properties).to.have.property('tags');
        expect(body.components.schemas.ChargeArea.properties.tags.type).to.be('array');
        expect(body.components.schemas.ChargeArea.properties.tags.items).to.have.property('type');
        expect(body.components.schemas.ChargeArea.properties.tags.items.type).to.be('string');

        done();
      });
    });

    it('recognizes array of literals - number', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(body.components.schemas.ChargeArea.properties).to.have.property('orders');
        expect(body.components.schemas.ChargeArea.properties.orders.type).to.be('array');
        expect(body.components.schemas.ChargeArea.properties.orders.items).to.have.property('type');
        expect(body.components.schemas.ChargeArea.properties.orders.items.type).to.be('number');

        done();
      });
    });

    it('recognizes array of ObjectId exposing IDs as string', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        //credits to https://github.com/mdhooge for providing the repro-sample
        expect(body.components.schemas).to.have.property('ChargeArea');
        expect(body.components.schemas).to.have.property('ChargeCluster');

        expect(body.components.schemas.ChargeArea.properties).to.have.property('clusters');
        expect(body.components.schemas.ChargeArea.properties.clusters.type).to.be('array');
        expect(body.components.schemas.ChargeArea.properties.clusters).to.have.property('items');
        expect(body.components.schemas.ChargeArea.properties.clusters.items).to.have.property('type');
        expect(body.components.schemas.ChargeArea.properties.clusters.items.type).to.be('string'); //ids refs -> string

        done();
      });
    });

  });

  describe('misc', function () {

    it('adds virtuals as model properties', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) { return done(err); }

        expect(response).to.have.property('statusCode', 200);

        expect(body.components.schemas.Vegetable).to.be.an(Object);
        expect(body.components.schemas.Vegetable.properties).to.have.property('id');
        expect(body.components.schemas.Vegetable.properties.id.type).to.be('string');

        done();
      });
    });
  });

  describe('custom options via optionsBuilder', function () {
    it('title', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.title).eql("my app");
        done();
      });
    });
    it('version', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.version).eql("3.14.15");
        done();
      });
    });
    it('description', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.description).eql("OpenAPI 3.0.0-RC implementors sample doc.");
        done();
      });
    });
    it('contact', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.contact).eql({
          name: "Pedro J. Molina",
          url: "http://pjmolina.com",
          email: "pjmolina@acme.com"
        });
        done();
      });
    });
    it('license', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.license).eql({
          name: 'Apache 2',
          url: 'http://apache.org'
        });
        done();
      });
    });
    it('termsOfService', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.info.termsOfService).eql("My TOS");
        done();
      });
    });
    it('servers are present', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.servers).to.be.an(Array);
        expect(body.servers[0].url).eql('http://api1.acme.com');
        expect(body.servers[0].description).eql('My prod server');
        expect(body.servers[0].variables.user.default).eql('alicia');
        expect(body.servers[0].variables.user.enum).eql(['demo', 'joe', 'alicia']);
        expect(body.servers[0].variables.user.description).eql('User name for authentication.');
        expect(body.servers[0].variables.env.default).eql('qa');
        expect(body.servers[0].variables.env.enum).eql(['dev', 'qa', 'prod']);

        done();
      });
    });
    it('SecuritySchemeBasicAuth is present', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.components.securitySchemes.authentication_basic).eql({
          type: 'http',
          scheme: 'basic'
        });
        done();
      });
    });
    it('SecurityJWT is present', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.components.securitySchemes.autentication_jwt).eql({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        });
        done();
      });
    });
    it('SecuritySchemeApiKey is present', function (done) {
      var options = {
        url: contractUrl,
        json: true
      };
      request.get(options, function (err, response, body) {
        if (err) {
          return done(err);
        }

        expect(body.components.securitySchemes.authentication_apikey).eql({
          type: 'apiKey',
          name: 'authentication_apikey',
          in: 'header'
        });
        done();
      });
    });

  });

  describe('pending - todo', function () {
    it('enum values');
    it('securityDefinitions is generated - via customization');
    it('security is generated - via customization');
    it('does not crash when a Mixed type is used');
    it('and more...');
  });

});