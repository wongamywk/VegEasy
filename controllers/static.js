'use strict';

//loads mimetype files
exports.public = {
  handler: {
    directory: {
        path: './public',
        listing: false,
        index: false
    }
}
};

//the following handles routing to static pages
exports.home = {
      handler: function (request, reply) {
      return reply.view('home');
      }
    };

exports.menu = {
          handler: function (request, reply) {
          return reply.view('menu');
          }
        };

exports.member = {
              handler: function (request, reply) {
              return reply.view('memberzone');
              }
            };

exports.contact = {
                  handler: function (request, reply) {
                  return reply.view('contact');
                  }
                };

exports.doc = {
                  handler: function (request, reply) {
                  return reply.view('documentation');
                  }
              };

exports.apiendpoints = {
                  handler: function (request, reply) {
                  return reply.view('apiendpoints');
                  }
              };

exports.map = {
                                handler:  (request, reply) => {
                                                  return reply.view('map');
                                                  }
                                                };
