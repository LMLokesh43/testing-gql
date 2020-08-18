"use strict";

var _config = require("../config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var AuthService = {
  getUser: function getUser(req) {
    var tokenHeader = req.headers.authorization || '';

    if (!tokenHeader) {
      return {};
    }

    var token = tokenHeader.replace('Bearer ', '');
    var data = jwt.verify(token, _config.JWT_SECRET);
    return _objectSpread({}, data);
  },
  getHashPassword: function () {
    var _getHashPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password) {
      var hashPassword;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return bcrypt.hash(password, 10);

            case 2:
              hashPassword = _context.sent;
              return _context.abrupt("return", hashPassword);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getHashPassword(_x) {
      return _getHashPassword.apply(this, arguments);
    }

    return getHashPassword;
  }(),
  checkPassword: function () {
    var _checkPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(inputPassword, userPassword) {
      var isValid;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return bcrypt.compare(inputPassword, userPassword);

            case 2:
              isValid = _context2.sent;
              return _context2.abrupt("return", isValid);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function checkPassword(_x2, _x3) {
      return _checkPassword.apply(this, arguments);
    }

    return checkPassword;
  }(),
  getToken: function getToken(data) {
    return jwt.sign(data, process.env.APP_SECRET);
  }
};
module.exports = AuthService;