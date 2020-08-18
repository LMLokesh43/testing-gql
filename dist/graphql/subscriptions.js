"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pubsub = void 0;

var _apolloServer = require("apollo-server");

var pubsub = new _apolloServer.PubSub();
exports.pubsub = pubsub;
var _default = pubsub;
exports["default"] = _default;