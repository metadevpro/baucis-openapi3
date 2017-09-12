// This is a Controller mixin to add methods for generating OpenAPI data.

// __Dependencies__
var mongoose = require('mongoose');
var utils = require('./utils');
var params = require('./parameters');

// __Private Members__

// __Module Definition__
module.exports = function () {
  var controller = this;

  // __Private Instance Members__


  function buildTags(resourceName) {
    return [resourceName];
  }

  function humanVerb(verb) {
    switch(verb) {
      case "put":
        return "Update";
      case "post":
        return "Create";
      default:
        return "undef";
    }
  }
  function buildRequestBodyFor(isInstance, verb, resourceName) {
    var requestBody = {
      description: humanVerb(verb) + " a " + resourceName +" by sending the paths to be updated in the request body.",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/" + utils.capitalize(resourceName)
          }
        }
      }
    };
    if (isInstance && (verb === 'post' || verb === 'put')) {
      return requestBody;
    }
    return null;
  }
  function buildResponsesFor(isInstance, verb, resourceName, pluralName) {
    var responses = {};

    //default errors on baucis httpStatus code + string
    responses.default = {
      description: 'Unexpected error.',
      content: {
        "application/json": {
          schema: {
            'type': 'string'
          }
        }
      }
    };
    if (isInstance || verb === 'post') {
      responses['200'] = {
        description: 'Sucessful response. Single resource.',
        content: {
          "application/json": {
            schema: {
              '$ref': '#/components/schemas/' + utils.capitalize(resourceName)
            }
          }
        }
      };
    } else {
      responses['200'] = {
        description: 'Sucessful response. Collection of resources.',
        content: {
          "application/json": {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/' + utils.capitalize(resourceName)
              }
            }
          }
        }
      };
    }
    // Add other errors if needed: (400, 403, 412 etc. )
    responses['404'] = {
      description: (isInstance) ?
        'No ' + resourceName + ' was found with that ID.' : 'No ' + pluralName + ' matched that query.',
      content: {
        "application/json": {
          schema: {
            'type': 'string'
          //'$ref': '#/components/schemas/ErrorModel'
          }
        }
      }
    };
    if (verb === 'put' || verb === 'post' || verb === 'patch') {
      responses['422'] = {
        description: 'Validation error.',
        content: {
          "application/json": {
            schema: {
              type: 'array',
              items: {
                '$ref': '#/components/schemas/ValidationError'
              }
            }
          }
        }
      };
    }
    return responses;
  }

  function buildSecurityFor() {
    return null; //no security defined
  }

  function buildOperationInfo(res, operationId, summary, description) {
    res.operationId = operationId;
    res.summary = summary;
    res.description = description;
    return res;
  }

  function buildBaseOperation(mode, verb, controller) {
    var resourceName = controller.model().singular();
    var pluralName = controller.model().plural();
    var isInstance = (mode === 'instance');
    var resourceKey = utils.capitalize(resourceName);
    var res = {
      parameters: params.generateOperationParameters(isInstance, verb),
      responses: buildResponsesFor(isInstance, verb, resourceName, pluralName)
    };
    var rBody = buildRequestBodyFor(isInstance, verb, resourceName);
    if (rBody) {
      res.requestBody = rBody;
    } 
    if (res.parameters.length === 0) {
      delete(res.parameters);
    }
    var sec = buildSecurityFor();
    if (sec) {
      res.security = sec;
    }

    if (isInstance) {
      return buildBaseOperationInstance(verb, res, resourceKey, resourceName);
    } else {
      //collection
      return buildBaseOperationCollection(verb, res, resourceKey, pluralName);
    }
  }

  function buildBaseOperationInstance(verb, res, resourceKey, resourceName) {
    if ('get' === verb) {
      return buildOperationInfo(res,
        'get' + resourceKey + 'ById',
        'Get a ' + resourceName + ' by its unique ID',
        'Retrieve a ' + resourceName + ' by its ID' + '.');
    } else if ('put' === verb) {
      return buildOperationInfo(res,
        'update' + resourceKey,
        'Modify a ' + resourceName + ' by its unique ID',
        'Update an existing ' + resourceName + ' by its ID' + '.');
    } else if ('delete' === verb) {
      return buildOperationInfo(res,
        'delete' + resourceKey + 'ById',
        'Delete a ' + resourceName + ' by its unique ID',
        'Deletes an existing ' + resourceName + ' by its ID' + '.');
    }
  }

  function buildBaseOperationCollection(verb, res, resourceKey, pluralName) {
    if ('get' === verb) {
      return buildOperationInfo(res,
        'query' + resourceKey,
        'Query some ' + pluralName,
        'Query over ' + pluralName + '.');
    } else if ('post' === verb) {
      return buildOperationInfo(res,
        'create' + resourceKey,
        'Create some ' + pluralName,
        'Create one or more ' + pluralName + '.');
    } else if ('delete' === verb) {
      return buildOperationInfo(res,
        'delete' + resourceKey + 'ByQuery',
        'Delete some ' + pluralName + ' by query',
        'Delete all ' + pluralName + ' matching the specified query.');
    }
  }

  function buildOperation(containerPath, mode, verb) {
    var resourceName = controller.model().singular();
    var operation = buildBaseOperation(mode, verb, controller);
    operation.tags = buildTags(resourceName);
    containerPath[verb] = operation;
    return operation;
  }

  // Convert a Mongoose type into an openAPI type
  function openApi30TypeFor(type) {
    if (!type) {
      return null;
    }
    if (type === Number) {
      return 'number';
    }
    if (type === Boolean) {
      return 'boolean';
    }
    if (type === String ||
      type === Date ||
      type === mongoose.Schema.Types.ObjectId ||
      type === mongoose.Schema.Types.Oid) {
      return 'string';
    }
    if (type === mongoose.Schema.Types.Array ||
      Array.isArray(type) ||
      type.name === "Array") {
      return 'array';
    }
    if (type === Object ||
      type instanceof Object ||
      type === mongoose.Schema.Types.Mixed ||
      type === mongoose.Schema.Types.Buffer) {
      return null;
    }
    throw new Error('Unrecognized type: ' + type);
  }

  function openApi30TypeFormatFor(type) {
    if (!type) {
      return null;
    }
    if (type === Number) {
      return 'double';
    }
    if (type === Date) {
      return 'date-time';
    }

    /*
    if (type === String) { return null; }
    if (type === Boolean) { return null; }
    if (type === mongoose.Schema.Types.ObjectId) { return null; }
    if (type === mongoose.Schema.Types.Oid) { return null; }
    if (type === mongoose.Schema.Types.Array) { return null; }
    if (Array.isArray(type) || type.name === "Array") { return null; }
    if (type === Object) { return null; }
    if (type instanceof Object) { return null; }
    if (type === mongoose.Schema.Types.Mixed) { return null; }
    if (type === mongoose.Schema.Types.Buffer) { return null; }
	*/
    return null;
  }

  function skipProperty(name, path, controller) {
    var select = controller.select();
    var mode = (select && select.match(/(?:^|\s)[-]/g)) ? 'exclusive' : 'inclusive';
    var exclusiveNamePattern = new RegExp('\\B-' + name + '\\b', 'gi');
    var inclusiveNamePattern = new RegExp('(?:\\B[+]|\\b)' + name + '\\b', 'gi');
    // Keep deselected paths private
    if (path.selected === false) {
      return true;
    }
    // _id always included unless explicitly excluded?

    // If it's excluded, skip this one.
    if (select && mode === 'exclusive' && select.match(exclusiveNamePattern)) {
      return true;
    }
    // If the mode is inclusive but the name is not present, skip this one.
    if (select && mode === 'inclusive' && name !== '_id' && !select.match(inclusiveNamePattern)) {
      return true;
    }
    return false;
  }
  // A method used to generated an OpenAPI property for a model
  function generatePropertyDefinition(name, path, definitionName) {
    var property = {};
    var type = path.options.type ? openApi30TypeFor(path.options.type) : 'string'; // virtuals don't have type

    if (skipProperty(name, path, controller)) {
      return;
    }
    // Configure the property
    if (path.options.type === mongoose.Schema.Types.ObjectId) {
      if ("_id" === name) {
        property.type = 'string';
      } else if (path.options.ref) {
        property.$ref = '#/components/schemas/' + utils.capitalize(path.options.ref);
      }
    } else if (path.schema) {
      //Choice (1. embed schema here or 2. reference and publish as a root definition)
      property.type = 'array';
      property.items = {
        //2. reference 
        $ref: '#/components/schemas/' + definitionName + utils.capitalize(name)
      };
    } else {
      property.type = type;
      if ('array' === type) {
        if (isArrayOfRefs(path.options.type)) {
          property.items = {
            type: 'string' //handle references as string (serialization for objectId)
          };
        } else {
          var resolvedType = referenceForType(path.options.type);
          if (resolvedType.isPrimitive) {
            property.items = {
              type: resolvedType.type
            };
          } else {
            property.items = {
              $ref: resolvedType.type
            };
          }
        }
      }
      var format = openApi30TypeFormatFor(path.options.type);
      if (format) {
        property.format = format;
      }
      if ('__v' === name) {
        property.format = 'int32';
      }
    }

    /*
    // Set enum values if applicable
    if (path.enumValues && path.enumValues.length > 0) {
      // Pending:  property.allowableValues = { valueType: 'LIST', values: path.enumValues };
    }
    // Set allowable values range if min or max is present
    if (!isNaN(path.options.min) || !isNaN(path.options.max)) {
      // Pending: property.allowableValues = { valueType: 'RANGE' };
    }
    if (!isNaN(path.options.min)) {
      // Pending: property.allowableValues.min = path.options.min;
    }
    if (!isNaN(path.options.max)) {
      // Pending: property.allowableValues.max = path.options.max;
    }
	*/
    if (!property.type && !property.$ref) {
      warnInvalidType(name, path);
      property.type = 'string';
    }
    return property;
  }

  function referenceForType(type) {
    if (type && type.length > 0 && type[0]) {
      var sw2Type = openApi30TypeFor(type[0]);
      if (sw2Type) {
        return {
          isPrimitive: true,
          type: sw2Type //primitive type
        };
      } else {
        return {
          isPrimitive: false,
          type: '#/components/schemas/' + type[0].name //not primitive: asume complex type def and reference schema
        };
      }
    }
    return {
      isPrimitive: true,
      type: 'string'
    }; //No info provided
  }

  function isArrayOfRefs(type) {
    return (type && type.length > 0 && type[0] && type[0].ref &&
      type[0].type && type[0].type.name === 'ObjectId');
  }

  function warnInvalidType(name, path) {
    console.log('Warning: That field type is not yet supported in baucis OpenAPI definitions, using "string."');
    console.log('Path name: %s.%s', utils.capitalize(controller.model().singular()), name);
    console.log('Mongoose type: %s', path.options.type);
  }

  function mergePaths(oaSchema, pathsCollection, definitionName) {
    Object.keys(pathsCollection).forEach(function (name) {
      var path = pathsCollection[name];
      var property = generatePropertyDefinition(name, path, definitionName);
      oaSchema.properties[name] = property;
      if (path.options.required) {
        oaSchema.required.push(name);
      }
    });
  }

  // A method used to generate an OpenAPI model schema for a controller
  function generateModelOpenApiSchema(schema, definitionName) {
    var oaSchema = {
      required: [],
      properties: {}
    };
    mergePaths(oaSchema, schema.paths, definitionName);
    mergePaths(oaSchema, schema.virtuals, definitionName);

    //remove empty arrays -> OpenAPI 3.0 validates 
    if (oaSchema.required.length === 0) {
      delete(oaSchema.required);
    }
    if (oaSchema.properties.length === 0) {
      delete(oaSchema.properties);
    }
    return oaSchema;
  }

  function mergePathsForInnerSchemaDef(schemaDefs, collectionPaths, definitionName) {
    Object.keys(collectionPaths).forEach(function (name) {
      var path = collectionPaths[name];
      if (path.schema) {
        var newdefinitionName = definitionName + utils.capitalize(name); //<-- synthetic name (no info for this in input model)
        var def = generateModelOpenApiSchema(path.schema, newdefinitionName);
        schemaDefs[newdefinitionName] = def;
      }
    });
  }

  function addInnerModelSchemas(schemaDefs, definitionName) {
    var schema = controller.model().schema;
    mergePathsForInnerSchemaDef(schemaDefs, schema.paths, definitionName);
    mergePathsForInnerSchemaDef(schemaDefs, schema.virtuals, definitionName);
  }

  // __Build the Definition__
  controller.generateOpenApi3 = function () {
    if (controller.openApi3) {
      return controller;
    }

    var modelName = utils.capitalize(controller.model().singular());

    controller.openApi3 = {
      paths: {},
      components: {
        schemas: {}
      }
    };

    // Add Resource Model
    controller.openApi3.components.schemas[modelName] =
      generateModelOpenApiSchema(controller.model().schema, modelName);

    addInnerModelSchemas(controller.openApi3.components.schemas, modelName);

    // Paths
    var pluralName = controller.model().plural();

    var collectionPath = '/' + pluralName;
    var instancePath = '/' + pluralName + '/{id}';

    var paths = {};
    buildPathParams(paths, instancePath, true);
    buildPathParams(paths, collectionPath, false);

    buildOperation(paths[instancePath], 'instance', 'get');
    buildOperation(paths[instancePath], 'instance', 'put');
    buildOperation(paths[instancePath], 'instance', 'delete');
    buildOperation(paths[collectionPath], 'collection', 'get');
    buildOperation(paths[collectionPath], 'collection', 'post');
    buildOperation(paths[collectionPath], 'collection', 'delete');
    controller.openApi3.paths = paths;

    return controller;
  };

  function buildPathParams(pathContainer, path, isInstance) {
    var pathParams = params.generatePathParameters(isInstance);
    if (pathParams.length > 0) {
      pathContainer[path] = {
        parameters: pathParams
      };
    }
  }

  return controller;
};