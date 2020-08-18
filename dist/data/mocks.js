"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.mocks = void 0;

var _faker = _interopRequireDefault(require("faker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mocks = {
  Date: function (_Date) {
    function Date() {
      return _Date.apply(this, arguments);
    }

    Date.toString = function () {
      return _Date.toString();
    };

    return Date;
  }(function () {
    return new Date();
  }),
  Int: function Int() {
    return parseInt(Math.random() * 100, 10);
  },
  String: function String() {
    return 'It works!';
  },
  Query: function Query() {
    return {
      user: function user(root, args) {
        return {
          email: args.email,
          messages: [{
            from: {
              email: args.email
            }
          }]
        };
      }
    };
  },
  User: function User() {
    return {
      email: _faker["default"].internet.email(),
      username: _faker["default"].internet.userName(),
      avatar: _faker["default"].internet.avatar(),
      description: _faker["default"].lorem.sentences(Math.random() * 3)
    };
  },
  Group: function Group() {
    return {
      name: _faker["default"].lorem.words(Math.random() * 3)
    };
  },
  Message: function Message() {
    return {
      text: _faker["default"].lorem.sentences(Math.random() * 3)
    };
  }
};
exports.mocks = mocks;
var _default = mocks;
exports["default"] = _default;