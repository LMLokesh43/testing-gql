"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROD_DB = exports.DATABASE = exports.JWT_SECRET = void 0;
var JWT_SECRET = 'secret';
exports.JWT_SECRET = JWT_SECRET;
var DATABASE = {
  username: 'root',
  password: 'root',
  database: 'chatbox',
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql'
};
exports.DATABASE = DATABASE;
var PROD_DB = {
  username: 'bf2cde344a6269',
  password: 'eb6ef63d',
  host: 'us-cdbr-east-02.cleardb.com',
  database: 'heroku_bc36afc8ae2b2fb',
  port: 3306,
  dialect: 'mysql'
};
exports.PROD_DB = PROD_DB;