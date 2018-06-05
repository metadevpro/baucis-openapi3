baucis-openapi3
===============


[![Build Status](https://travis-ci.org/metadevpro/baucis-openapi3.svg)](https://travis-ci.org/metadevpro/baucis-openapi3)
[![Coverage Status](https://coveralls.io/repos/github/metadevpro/baucis-openapi3/badge.svg?branch=master)](https://coveralls.io/github/metadevpro/baucis-openapi3?branch=master)
[![Dependency Status](https://david-dm.org/metadevpro/baucis-openapi3.svg)](https://david-dm.org/metadevpro/baucis-openapi3)
[![Known Vulnerabilities](https://snyk.io/test/npm/baucis-openapi3/badge.svg)](https://snyk.io/test/npm/baucis-openapi3)
[![npm version](https://badge.fury.io/js/baucis-openapi3.svg)](http://badge.fury.io/js/baucis-openapi3)
[![Greenkeeper badge](https://badges.greenkeeper.io/metadevpro/baucis-openapi3.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/baucis-openapi3.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/baucis-openapi3/)


This module generates customizable [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) definitions for your Baucis API.
Use this module in conjunction with [Baucis](https://github.com/wprl/baucis).


Usage
-----

Install with:

    npm install --save baucis baucis-openapi3

Include the package after baucis is included, and before your API is built.

```javascript
    var express = require('express');
    var baucis = require('baucis');
    var apiDoc = require('baucis-openapi3');

    var app = express();

    // ... Set up a mongoose schema ...

    baucis.rest('vegetable');
    app.use('/api', baucis());
```

Then, access e.g. `GET http://localhost:3333/api/openapi.json`.  See the [Baucis](https://github.com/wprl/baucis) repo for more information about building REST APIs with [Baucis](https://github.com/wprl/baucis).

Tests
-----
Change the `test/fixures/config.json` if needed, to point to a valid mongodb database.
Then run:

```
npm test
```


Extensibility
-------------

If you want to modify the OpenAPI definition, generate the definition first.  (This will happen automatically otherwise.)

Use the `openApi3` member of the controller to extend `paths` and `components` per controller.

```javascript
controller.generateOpenApi3();
controller.openApi3.paths.xyz = '123';
controller.openApi3.components.schemas.xyz = {};
```

Or use the `openApi3Document` of the baucis instance module to access and modify dirrecty the full document after calling `generateOpenApi3()` on the API.

```javascript
var baucisInstance = baucis();

//generate standard template for OpenAPI3
baucisInstance.generateOpenApi3();
//extend OpenAPI3 definitions
baucisInstance.openApi3Document.info.title = "myApi";

app.use('/api', baucisInstance);
```

Backward compatibility
----------------------

In case you want to provide an easy transition as possible for your current API clients. You can expose both API descriptions at the same time including both modules:

```javascript
    var express = require('express');
    var baucis = require('baucis');
    var swagger = require('baucis-swagger');
    var swagger2 = require('baucis-swagger2');
    var openapi3 = require('baucis-openapi3');

    var app = express();

    // ... Set up a mongoose schema ...

    baucis.rest('vegetable');
    app.use('/api', baucis());
```

After that:
- Swagger 1.1 doc will be exposed at `/api/documentation`
- Swagger 2.0 doc will be exposed at `/api/swagger.json`
- OpenAPI 3.0 doc will be exposed at `/api/openapi.json`


Contact
-------

 * [@metad3v](https://twitter.com/metad3v) https://metadev.pro
 * [@pmolinam](https://twitter.com/pmolinam)

Released under MIT License. &copy; 2017-2018 Metadev
