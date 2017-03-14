// Options builder. Helper classes to to customize generated OpenAPI 3
// fluent API style

function buildOptions() {
    return new OpenApi3Options();
}

// OpenApi3Options class
function OpenApi3Options() {
    ensureHasInfo(this);
}
OpenApi3Options.prototype.title = function(title) {
    this.info.title = title;
    return this;
};
OpenApi3Options.prototype.version = function(version) {
    this.info.version = version;
    return this;
};
OpenApi3Options.prototype.description = function(description) {
    this.info.description = description;
    return this;
};
OpenApi3Options.prototype.termsOfService = function(termsOfService) {
    this.info.termsOfService = termsOfService;
    return this;
};
OpenApi3Options.prototype.contact = function(name, url, email) {
    this.info.contact = {
        name: name,
        url: url,
        email: email
    };
    return this;
};
OpenApi3Options.prototype.license = function(name, url) {
    this.info.license = {
        name: name,
        url: url
    };
    return this;
};
OpenApi3Options.prototype.addServer = function(url, description, variables) {
    ensureHasServers(this);
    this.servers.push({
        url: url,
        description: description,
        variables: variables
    });
    return this;
};
OpenApi3Options.prototype.externalDoc = function(description, url) {
    this.externalDoc = {
        description: description,
        url: url
    };
    return this;
};
OpenApi3Options.prototype.addSecuritySchemeBasicAuth = function(name) {
    ensureHasComponents(this);
    var data = {
        type: "http",
        scheme: "basic"
    };
    this.components.securitySchemes[name] = data;
    return this;
};
OpenApi3Options.prototype.addSecuritySchemeApiKey = function(name, inLocation) {
    ensureHasComponents(this);
    var data = {
        type: "apiKey",
        name: name,
        in: inLocation || "header"
    };
    this.components.securitySchemes[name] = data;
    return this;
};
OpenApi3Options.prototype.addSecurityJWT = function(name) {
    ensureHasComponents(this);
    var data = {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
    };
    this.components.securitySchemes[name] = data;
    return this;
};
OpenApi3Options.prototype.addSecuritySchemeOAuth2Implicit = function(name, authUrl, scopes) {
    ensureHasComponents(this);
    var data = {
        type: "oauth2",
        flow: {
            implicit: {
                authorizationUrl: authUrl,
                scopes: scopes
            }
        }
    };
    this.components.securitySchemes[name] = data;
    return this;
};
OpenApi3Options.prototype.addSecuritySchemeOAuth2AuthCode = function(name, authUrl, tokenUrl, scopes) {
    ensureHasComponents(this);
    var data = {
        type: "oauth2",
        flow: {
            authorizationCode: {
                authorizationUrl: authUrl,
                tokenUrl: tokenUrl,
                scopes: scopes
            }
        }
    };
    this.components.securitySchemes[name] = data;
    return this;
};


// Helpers ---
function ensureHasInfo(opt) {
    if (!opt.info) {
        opt.info = {
            title: "app",
            version: "0.0.1"        
        };
    }
}
function ensureHasServers(opt) {
    if (!opt.servers) {
        opt.servers = [];
    }
}
function ensureHasComponents(opt) {
    if (!opt.components) {
        opt.components = {
            schemas: {},
            parameters: {},
            responses: {},
            securitySchemes: {},
            
        };
    }
}

// Server variables -----
function buildServerVariables() {
    return new ServerVariables();
}

function ServerVariables() {    
}

ServerVariables.prototype.addServerVar = function(name, enumerations, defaultValue, description) {
    var vData = {
        default: defaultValue
    };
    if (enumerations) {
        vData.enum = enumerations;
    }
    if (description) {
        vData.description = description        
    }
    this[name] = vData;
    return this;
}

// Export options builder
module.exports = {
    buildOptions: buildOptions,
    buildServerVariables: buildServerVariables 
};
