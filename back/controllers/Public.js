'use strict';

var url = require('url');

var Public = require('./PublicService');

module.exports.getVideoListGET = function getVideoListGET (req, res, next) {
  Public.getVideoListGET(req.swagger.params, res, next);
};

module.exports.getWatchVideoGET = function getWatchVideoGET (req, res, next) {
  Public.getWatchVideoGET(req.swagger.params, res, next, req);
};

module.exports.rootGET = function rootGET (req, res, next) {
  Public.rootGET(req.swagger.params, res, next);
};
