var expect = require('expect.js');
var sut = require('../index');

describe("OptionsBuilder", function() {
    it("empty options", function() {
        expect(sut.buildOptions()).eql({
            info: {
                title: "app",
                version: "0.0.1"
            }
        });
    });
    it("add title", function() {
        expect(sut.buildOptions().title("Spook")).eql({
            info: {
                title: "Spook",
                version: "0.0.1"
            }
        });
    });
    it("add title, add version", function() {
        expect(sut.buildOptions().title("Spook").
                                  version("3.14.0")).eql({
            info: {
                title: "Spook",
                version: "3.14.0"
            }
        });
    });   
    it("add title, add description", function() {
        expect(sut.buildOptions().title("Spook").
                                  description("my desc")).eql({
            info: {
                title: "Spook",
                version: "0.0.1",
                description: "my desc"
            }
        });
    });
    it("add title, add termsOfService", function() {
        expect(sut.buildOptions().title("Spook").
                                  termsOfService("my TOS")).eql({
            info: {
                title: "Spook",
                version: "0.0.1",
                termsOfService: "my TOS"
            }
        });
    });
    it("add contact", function() {
        expect(sut.buildOptions().contact("Alicia", "http://ali.ce", "alicia@ali.ce")).eql({
            info: {
                title: "app",
                version: "0.0.1",
                contact: {
                    name: "Alicia",
                    url: "http://ali.ce",
                    email: "alicia@ali.ce",
                }
            }
        });
    });
    it("add license", function() {
        expect(sut.buildOptions().license("MIT", "http://mit.edu/license")).eql({
            info: {
                title: "app",
                version: "0.0.1",
                license: {
                    name: "MIT",
                    url: "http://mit.edu/license"
                }
            }
        });
    });
    it("add server", function() {
        expect(sut.buildOptions().addServer("http://api.acme.com", "Prod server", {})).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            servers: [{
                url: "http://api.acme.com",
                description: "Prod server",
                variables: {}
            }]
        });
    }); 
    it("add a 2nd server", function() {
        expect(sut.buildOptions().
                  addServer("http://api.acme.com", "Prod 1 server", {}).
                  addServer("http://api2.acme.com", "Prod 2 server", {})
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            servers: [{
                url: "http://api.acme.com",
                description: "Prod 1 server",
                variables: {}
            }, {
                url: "http://api2.acme.com",
                description: "Prod 2 server",
                variables: {}
            }]
        });
    });
    it("add externalDoc", function() {
        expect(sut.buildOptions().
                  externalDoc("My external doc", "http://doc.acme.com")
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            externalDoc: {
                description: "My external doc", 
                url: "http://doc.acme.com"
            }
        });
    });  
    it("add addSecuritySchemeBasicAuth", function() {
        expect(sut.buildOptions().
                  addSecuritySchemeBasicAuth("auth9")
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},                
                securitySchemes: {
                    auth9: {
                        scheme: "basic",
                        type: "http"
                    }
               }
            }
        });
    });
    it("add addSecuritySchemeApiKey", function() {
        expect(sut.buildOptions().
                  addSecuritySchemeApiKey("apikey5", "header")
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},                
                securitySchemes: {
                    apikey5: {
                        name: "apikey5",
                        type: "apiKey",
                        in: "header"
                    }
               }
            }
        });
    });
    it("add addSecuritySchemeApiKey missing in", function() {
        expect(sut.buildOptions().
                  addSecuritySchemeApiKey("apikey5")
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},                
                securitySchemes: {
                    apikey5: {
                        name: "apikey5",
                        type: "apiKey",
                        in: "header"
                    }
               }
            }
        });
    });    
    it("add addSecurityJWT", function() {
        expect(sut.buildOptions().
                  addSecurityJWT("jwt27")
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},                
                securitySchemes: {
                    jwt27: {
                        bearerFormat: "JWT",
                        scheme: "bearer",
                        type: "http"
                    }
               }
            }
        });
    });
    it("add addSecuritySchemeOAuth2Implicit", function() {
        expect(sut.buildOptions().
                  addSecuritySchemeOAuth2Implicit("oaImplicit7", "http://my.app/authorize", {
                      "scope1": "my scope 1",
                      "scope2": "my scope 2"
                  })
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},                
                securitySchemes: {
                    oaImplicit7: {
                        type: "oauth2",
                        flow: {
                            implicit: {
                                authorizationUrl: "http://my.app/authorize",
                                scopes: {
                                    "scope1": "my scope 1",
                                    "scope2": "my scope 2"
                                }
                            }
                        }
                    }
               }
            }
        });
    });
    it("add addSecuritySchemeOAuth2AuthCode", function() {
        expect(sut.buildOptions().
                   addSecuritySchemeOAuth2AuthCode("ac5", 
                    "http://my.app/authorize", 
                    "http://my.app/token", {
                      "scope1": "my scope 1",
                      "scope2": "my scope 2"
                  })
                  ).eql({
            info: {
                title: "app",
                version: "0.0.1"
            },
            components: {
                schemas: {},
                parameters: {},
                responses: {},
                securitySchemes: {
                    ac5: {
                        type: "oauth2",
                        flow: {
                            authorizationCode: {
                                authorizationUrl: "http://my.app/authorize",
                                tokenUrl: "http://my.app/token",
                                scopes: {
                                    "scope1": "my scope 1",
                                    "scope2": "my scope 2"
                                }
                            }
                        }
                    }
               }
            }
        });
    }); 
}); 

describe("Server Variables", function() {
    it("empty vars", function() {
        expect(sut.buildServerVariables()
        ).eql({});
    });  
    it("add serverVariable", function() {
        expect(sut.buildServerVariables().
                   addServerVar("v1", ["red", "green", "yellow"], "red", "Test result colors.")
        ).eql({
            v1: {
                default: "red",
                description: "Test result colors.",
                enum:  ["red", "green", "yellow"],
            }
        });
    });
    it("add more serverVariables", function() {
        expect(sut.buildServerVariables().
                   addServerVar("v1", ["red", "green", "yellow"], "red", "Test result colors.").
                   addServerVar("v2", [1, 2], 1, null).
                   addServerVar("v3", null, "abc", "Desc 2")
        ).eql({
            v1: {
                default: "red",
                description: "Test result colors.",
                enum:  ["red", "green", "yellow"]
            },
            v2: {
                default: 1,
                enum:  [1, 2]
            },
            v3: {
                default: "abc",
                description: "Desc 2"
            }
        });
    }); 
});