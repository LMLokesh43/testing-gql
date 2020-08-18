"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _faker = _interopRequireDefault(require("faker"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _connectors = require("./connectors");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var seed = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2() {
    var hash, user1;
    return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bcrypt["default"].hash('123456', 10);

          case 3:
            hash = _context2.sent;
            _context2.next = 6;
            return _connectors.UserModel.create({
              username: "firstUser",
              email: "email@email.com",
              avatar: _faker["default"].internet.avatar(),
              description: _faker["default"].lorem.sentences(3),
              password: hash,
              lastActiveAt: new Date()
            });

          case 6:
            user1 = _context2.sent;

            _toConsumableArray(Array(15).keys()).map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee(index, i) {
                var user2, chat1, message1, message2, group1;
                return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _connectors.UserModel.create({
                          username: "user".concat(index),
                          email: "email".concat(index, "@email.com"),
                          avatar: _faker["default"].internet.avatar(),
                          description: _faker["default"].lorem.sentences(3),
                          password: hash,
                          lastActiveAt: new Date()
                        });

                      case 2:
                        user2 = _context.sent;
                        _context.next = 5;
                        return _connectors.ChatModel.create({});

                      case 5:
                        chat1 = _context.sent;
                        _context.next = 8;
                        return _connectors.MessageModel.create({
                          text: _faker["default"].lorem.sentences(3)
                        });

                      case 8:
                        message1 = _context.sent;
                        _context.next = 11;
                        return _connectors.MessageModel.create({
                          text: _faker["default"].lorem.sentences(3)
                        });

                      case 11:
                        message2 = _context.sent;
                        _context.next = 14;
                        return _connectors.GroupModel.create({
                          name: "group".concat(index),
                          avatar: _faker["default"].internet.avatar(),
                          description: _faker["default"].lorem.sentences(3),
                          isPrivate: !!(index % 2) // 0,1

                        });

                      case 14:
                        group1 = _context.sent;
                        _context.next = 17;
                        return group1.addUser(user1);

                      case 17:
                        _context.next = 19;
                        return group1.addUser(user2);

                      case 19:
                        _context.next = 21;
                        return group1.setOwner(user1);

                      case 21:
                        _context.next = 23;
                        return message1.setChat(chat1);

                      case 23:
                        _context.next = 25;
                        return message2.setChat(chat1);

                      case 25:
                        _context.next = 27;
                        return message1.setUser(user1);

                      case 27:
                        _context.next = 29;
                        return message2.setUser(user2);

                      case 29:
                        _context.next = 31;
                        return chat1.setGroup(group1);

                      case 31:
                        _context.next = 33;
                        return user1.addChat(chat1);

                      case 33:
                        _context.next = 35;
                        return user2.addChat(chat1);

                      case 35:
                        if (!(index % 2)) {
                          _context.next = 38;
                          break;
                        }

                        _context.next = 38;
                        return user1.addFriend(user2);

                      case 38:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x, _x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function seed() {
    return _ref.apply(this, arguments);
  };
}();

var _default = seed;
exports["default"] = _default;