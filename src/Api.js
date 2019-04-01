// __Dependencies__
var utils = require('./utils');
var params = require('./parameters');

// __Private Module Members__

// Implements OpenAPI 3.0.0-RC (implementers draft) as described in:
// https://www.openapis.org/blog/2017/03/01/openapi-spec-3-implementers-draft-released#
// https://github.com/OAI/OpenAPI-Specification/blob/3.0.0-rc0/versions/3.0.md


// Figure out the basePath for OpenAPI definition
function getBase(request, extra) {
  var parts = request.originalUrl.split('/');
  // Remove extra path parts.
  parts.splice(-extra, extra);
  var base = parts.join('/');
  return base;
}

function generateValidationErrorSchema() {
  var def = {
    required: ['message', 'name', 'kind', 'path'],
    properties: {
      properties: {
        '$ref': '#/components/schemas/ValidationErrorProperties'
      },
      message: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      kind: {
        type: 'string'
      },
      path: {
        type: 'string'
      }
    }
  };
  return def;
}

function generateValidationErrorPropertiesSchema() {
  var def = {
    required: ['type', 'message', 'path'],
    properties: {
      type: {
        type: 'string'
      },
      message: {
        type: 'string'
      },
      path: {
        type: 'string'
      }
    }
  };
  return def;
}

function buildTags(opts, controllers) {
  var tags = [];
  if (controllers) {
    controllers.forEach(function (controller) {
      tags.push({
        name: controller.model().singular(),
        description: utils.capitalize(controller.model().singular()) + ' resource.',
        'x-resource': true //custom extension to state this tag represent a resource
      });
    });
  }
  return tags;
}

function buildPaths(opts, controllers) {
  var paths = {};
  if (controllers) {
    controllers.forEach(function (controller) {
      controller.generateOpenApi3();
      var collection = controller.openApi3.paths;
      for (var path in collection) {
        if (collection.hasOwnProperty(path)) {
          paths[path] = collection[path];
        }
      }
    });
  }
  return paths;
}
function buildDefaultServers() {
  return [{
      url: "/api"
    }];
}
// A method for generating OpenAPI resource listing
function generateResourceListing(options) {
  var controllers = options.controllers;
  var opts = options.options || {};

  var listing = {
    openapi: '3.0.0',
    info: buildInfo(opts),
    servers: opts.servers || buildDefaultServers(),
    tags: buildTags(opts, controllers),
    paths: buildPaths(opts, controllers),
    components: buildComponents(opts, controllers)
  };

  mergeIn(listing.paths, opts.paths);

  if (opts.security) {
    listing.security = opts.security;
  }
  if (opts.externalDocs) {
    listing.externalDocs = opts.externalDocs;
  }

  return listing;
}

function defaultIfMissing(obj, prop, defaultValue) {
  if (!obj) {
    return;
  }
  if (!obj.hasOwnProperty(prop) || obj[prop] == null) {
    if (defaultValue) {
      obj[prop] = defaultValue;
    } else {
      delete obj[prop];
    }
  }
}

function buildInfo(options) {
  var info = options.info || {};
  defaultIfMissing(info, 'title', 'api');
  defaultIfMissing(info, 'description', 'Baucis generated OpenAPI v.3 documentation.');
  defaultIfMissing(info, 'version', null);

  // defaultIfMissing(info, 'termsOfService', null);

  // defaultIfMissing(info, 'contact', {
  //   name: "name",
  //   url: "http://acme.com",
  //   email: "name@acme.com"
  // });

  // defaultIfMissing(info, 'license', {
  //   name: "Apache 2.0",
  //   url: "http://www.apache.org/licenses/LICENSE-2.0.html"
  // });

  return info;
}


function buildComponents(options, controllers) {
  var components = clone(options.components);

  defaultIfMissing(components, "schemas", {});
  defaultIfMissing(components, "responses", {});
  defaultIfMissing(components, "parameters", {});
  defaultIfMissing(components, "examples", {});
  defaultIfMissing(components, "requestBodies", {});
  defaultIfMissing(components, "headers", {});
  defaultIfMissing(components, "securitySchemes", {});
  defaultIfMissing(components, "links", {});
  defaultIfMissing(components, "callbacks", {});

  mergeIn(components.schemas, buildSchemas(controllers));
  mergeIn(components.responses, buildResponses(controllers));
  mergeIn(components.parameters, buildParameters(controllers));
  mergeIn(components.examples, buildExamples(controllers));
  mergeIn(components.requestBodies, buildRequestBodies(controllers));
  mergeIn(components.headers, buildHeaders(controllers));
  mergeIn(components.securitySchemes, buildSecuritySchemes(options, controllers));
  mergeIn(components.links, buildLinks(controllers));
  mergeIn(components.callbacks, buildCallbacks(controllers));

  return components;
}

function buildSchemas(controllers) {
  var schemas = {};
  controllers.forEach(function (controller) {
    controller.generateOpenApi3();
    var collection = controller.openApi3.components.schemas;
    for (var def in collection) {
      if (collection.hasOwnProperty(def)) {
        schemas[def] = collection[def];
      }
    }
  });
  schemas.ValidationError = generateValidationErrorSchema();
  schemas.ValidationErrorProperties = generateValidationErrorPropertiesSchema();
  return schemas;
}

function buildParameters(controllers) {
  controllers.forEach(function () {});
  return params.generateCommonParams();
}

function buildResponses(controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildSecuritySchemes(options, controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildExamples(controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildRequestBodies(controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildHeaders(controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildLinks(controllers) {
  controllers.forEach(function () {});
  return {};
}

function buildCallbacks(controllers) {
  controllers.forEach(function () {});
  return {};
}

function clone(obj) {
  if (!obj) {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
}

//build an specific spec based on options and filtered controllers
function generateResourceListingForVersion(options) {
  var clone = JSON.parse(JSON.stringify(options.rootDocument));
  if (!clone.info.version) {
    //Set baucis version if not provided previously by options
    clone.info.version = options.version;
  }
  clone.paths = clone.paths || {};
  mergeIn(clone.paths, buildPaths(options.controllers));

  clone.components.schemas = clone.components.schemas || {};
  var compo2 = buildComponents(options, options.controllers);
  mergeIn(clone.components.schemas, compo2.schemas);

  return clone;
}

function mergeIn(container, items) {
  if (!items) {
    return;
  }
  for (var key in items) {
    if (items.hasOwnProperty(key)) {
      container[key] = items[key];
    }
  }
}


// __Module Definition__
module.exports = function (options, protect) {
  var api = this;
  var customOpts = options;

  api.generateOpenApi3 = function (opts) {
    if (opts) {
      customOpts = opts;
    }
    //user can extend this openApi3Document
    api.openApi3Document = generateResourceListing({
      version: null,
      controllers: protect.controllers('0.0.1'),
      basePath: null,
      options: customOpts
    });
    return api;
  };

  // Middleware for the documentation index.
  api.get('/openapi.json', function (request, response) {
    try {
      if (!api.openApi3Document) {
        api.generateOpenApi3(customOpts);
      }

      //Customize a openApi3Document copy by requested version
      var versionedApi = generateResourceListingForVersion({
        rootDocument: api.openApi3Document,
        version: request.baucis.release,
        controllers: protect.controllers(request.baucis.release),
        basePath: getBase(request, 1),
        options: customOpts
      });

      response.json(versionedApi);
    } catch (e) {
      console.error(JSON.stringify(e));
      response.status(500).json(e);
    }
  });

  return api;
};