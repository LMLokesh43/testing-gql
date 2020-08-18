"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userLogic = exports.queryLogic = exports.mutationLogic = void 0;

var _apolloServer = require("apollo-server");

var _sequelize = _interopRequireDefault(require("sequelize"));

var _connectors = require("../data/connectors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Op = _sequelize["default"].Op; // reusable function to check for a user with context

function getAuthenticatedUser(ctx) {
  // return UserModel.findOne({ where: { id: 1 } });
  return ctx.user.then(function (user) {
    if (!user) {
      throw new _apolloServer.AuthenticationError('Unauthenticated');
    }

    return user;
  });
}

function isUserAuth(_x, _x2) {
  return _isUserAuth.apply(this, arguments);
}

function _isUserAuth() {
  _isUserAuth = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(userId, ctx) {
    var authUser;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return getAuthenticatedUser(ctx);

          case 2:
            authUser = _context15.sent;

            if (!(authUser.id !== userId)) {
              _context15.next = 5;
              break;
            }

            throw new _apolloServer.ForbiddenError('Unauthorized');

          case 5:
            return _context15.abrupt("return", authUser);

          case 6:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _isUserAuth.apply(this, arguments);
}

var mutationLogic = {
  createMessage: function createMessage(_, _ref, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var text, chatId, user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              text = _ref.text, chatId = _ref.chatId;
              _context.next = 3;
              return getAuthenticatedUser(ctx);

            case 3:
              user = _context.sent;
              return _context.abrupt("return", _connectors.MessageModel.create({
                userId: user.id,
                chatId: chatId,
                text: text
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};
exports.mutationLogic = mutationLogic;
var queryLogic = {
  chat: function chat(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var authUser, chatIds, isInTheChat;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getAuthenticatedUser(ctx);

            case 2:
              authUser = _context2.sent;
              _context2.next = 5;
              return authUser.getChats({
                attributes: ['id']
              }).map(function (chat) {
                return chat.id;
              });

            case 5:
              chatIds = _context2.sent;
              isInTheChat = chatIds.find(function (id) {
                return id === args.chatId;
              });

              if (!isInTheChat) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", _connectors.ChatModel.findOne({
                where: {
                  id: args.chatId
                }
              }));

            case 9:
              throw new _apolloServer.ForbiddenError('Unauthorized');

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  chats: function chats(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var authUser;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return isUserAuth(args.userId, ctx);

            case 2:
              authUser = _context3.sent;
              return _context3.abrupt("return", authUser.getChats());

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  group: function group(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", _connectors.GroupModel.findOne({
                where: {
                  id: args.groupId
                }
              }));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  },
  groups: function groups(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var authUser;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return isUserAuth(args.userId, ctx);

            case 2:
              authUser = _context5.sent;
              return _context5.abrupt("return", authUser.getGroups({
                where: {
                  name: _defineProperty({}, Op.not, 'default')
                }
              }));

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  },
  allGroups: function allGroups(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", _connectors.GroupModel.findAll({
                where: {
                  name: _defineProperty({}, Op.not, 'default'),
                  isPrivate: false
                }
              }));

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }))();
  },
  chatGroups: function chatGroups(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var authUser;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return isUserAuth(args.userId, ctx);

            case 2:
              authUser = _context7.sent;
              return _context7.abrupt("return", authUser.getGroups());

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  },
  users: function users(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var user, users;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return getAuthenticatedUser(ctx);

            case 2:
              user = _context8.sent;
              users = _connectors.UserModel.findAll({
                where: {
                  id: _defineProperty({}, Op.not, user.id)
                }
              });
              return _context8.abrupt("return", users);

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }))();
  },
  friends: function friends(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      var authUser;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return isUserAuth(args.id, ctx);

            case 2:
              authUser = _context9.sent;
              return _context9.abrupt("return", authUser.getFriends());

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }))();
  },
  user: function user(_, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      var where, user;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              //everyone can see everyones profile
              where = args.id ? {
                id: args.id
              } : {
                email: args.email
              };
              _context10.next = 3;
              return _connectors.UserModel.findOne({
                where: where
              });

            case 3:
              user = _context10.sent;
              return _context10.abrupt("return", user);

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }))();
  },
  paginatedUsers: function paginatedUsers(_, _ref2, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      var first, after, authUser, where, firstUser, users, edges, _hasNextPage, _cursor, user, pageInfo;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              first = _ref2.first, after = _ref2.after;
              _context11.next = 3;
              return getAuthenticatedUser(ctx);

            case 3:
              authUser = _context11.sent;

              if (!after) {
                _context11.next = 8;
                break;
              }

              where = _defineProperty({}, Op.and, [{
                id: _defineProperty({}, Op.gt, after)
              }, {
                id: _defineProperty({}, Op.ne, authUser.id)
              }]);
              _context11.next = 12;
              break;

            case 8:
              _context11.next = 10;
              return _connectors.UserModel.findOne({
                where: {
                  id: _defineProperty({}, Op.ne, authUser.id)
                },
                order: [['id', 'ASC']]
              });

            case 10:
              firstUser = _context11.sent;
              where = _defineProperty({}, Op.and, [{
                id: _defineProperty({}, Op.gte, firstUser.id)
              }, {
                id: _defineProperty({}, Op.ne, authUser.id)
              }]);

            case 12:
              _context11.next = 14;
              return _connectors.UserModel.findAll({
                where: where,
                order: [['id', 'ASC']],
                limit: first
              });

            case 14:
              users = _context11.sent;
              edges = users.map(function (user) {
                return {
                  node: user
                };
              });
              _cursor = users[users.length - 1].id; //last elem id

              if (!(users.length < first)) {
                _context11.next = 21;
                break;
              }

              _hasNextPage = false;
              _context11.next = 25;
              break;

            case 21:
              _context11.next = 23;
              return _connectors.UserModel.findOne({
                where: _defineProperty({}, Op.and, [{
                  id: _defineProperty({}, Op.gt, users[users.length - 1].id)
                }, {
                  id: _defineProperty({}, Op.ne, authUser.id)
                }]),
                order: [['id', 'ASC']]
              });

            case 23:
              user = _context11.sent;
              _hasNextPage = !!user;

            case 25:
              pageInfo = {
                hasNextPage: function hasNextPage() {
                  return _hasNextPage;
                },
                cursor: function cursor() {
                  return _cursor;
                }
              };
              return _context11.abrupt("return", {
                edges: edges,
                pageInfo: pageInfo
              });

            case 27:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }))();
  }
};
exports.queryLogic = queryLogic;
var userLogic = {
  chats: function chats(user, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return isUserAuth(user.id, ctx);

            case 2:
              return _context12.abrupt("return", user.getChats());

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }))();
  },
  friends: function friends(user, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return isUserAuth(user.id, ctx);

            case 2:
              return _context13.abrupt("return", user.getFriends());

            case 3:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }))();
  },
  groups: function groups(user, args, ctx) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return isUserAuth(user.id, ctx);

            case 2:
              return _context14.abrupt("return", user.getGroups());

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }))();
  },
  jwt: function jwt(user, args, ctx) {
    return Promise.resolve(user.jwt);
  }
};
exports.userLogic = userLogic;