"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resolvers = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _graphqlDate = _interopRequireDefault(require("graphql-date"));

var _apolloServer = require("apollo-server");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _faker = _interopRequireDefault(require("faker"));

var _connectors = require("../data/connectors");

var _subscriptions = require("./subscriptions");

var _config = require("../config");

var _logic = require("../util/logic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// connectori su orm mapiranja, a resolveri su orm upiti mapiranja na graphql
// Group, Message, User sequelize modeli tabele
//
var MESSAGE_ADDED_TOPIC = 'messageAdded';
var GROUP_ADDED_TOPIC = 'groupAdded';
var MESSAGE_IN_GROUP_ADDED_TOPIC = 'messageInGroupAdded';
var Op = _sequelize["default"].Op;
var resolvers = {
  Date: _graphqlDate["default"],
  Subscription: {
    messageAdded: {
      subscribe: (0, _apolloServer.withFilter)(function () {
        return _subscriptions.pubsub.asyncIterator(MESSAGE_ADDED_TOPIC);
      }, /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payload, args) {
          var group, chat;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _connectors.GroupModel.findOne({
                    where: {
                      id: args.groupId
                    }
                  });

                case 2:
                  group = _context.sent;
                  _context.next = 5;
                  return group.getChat();

                case 5:
                  chat = _context.sent;
                  return _context.abrupt("return", Boolean(chat.id === payload.messageAdded.chatId));

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }())
    },
    groupAdded: {
      subscribe: (0, _apolloServer.withFilter)(function () {
        return _subscriptions.pubsub.asyncIterator(GROUP_ADDED_TOPIC);
      }, function (payload, args) {
        return Boolean(true
        /*args.userId === payload.groupAdded.userId*/
        );
      })
    },
    messageInGroupAdded: {
      subscribe: (0, _apolloServer.withFilter)(function () {
        return _subscriptions.pubsub.asyncIterator(MESSAGE_IN_GROUP_ADDED_TOPIC);
      }, function (payload, args) {
        return Boolean(true
        /*args.userId === payload.defaultGroupAdded.userId*/
        );
      })
    }
  },
  Mutation: {
    addFriend: function addFriend(_, _ref2, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var userId, friendId, user, friendAlreadyExists, friend;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userId = _ref2.userId, friendId = _ref2.friendId;
                _context2.next = 3;
                return _connectors.UserModel.findOne({
                  where: {
                    id: userId
                  }
                });

              case 3:
                user = _context2.sent;
                _context2.next = 6;
                return user.getFriends({
                  where: {
                    id: friendId
                  }
                });

              case 6:
                friendAlreadyExists = _context2.sent;

                if (!(friendAlreadyExists.length > 0)) {
                  _context2.next = 9;
                  break;
                }

                throw new _apolloServer.ApolloError('user with that friendId is already friend', 404);

              case 9:
                _context2.next = 11;
                return _connectors.UserModel.findOne({
                  where: {
                    id: friendId
                  }
                });

              case 11:
                friend = _context2.sent;
                _context2.next = 14;
                return user.addFriend(friend);

              case 14:
                return _context2.abrupt("return", user);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    removeFriend: function removeFriend(_, _ref3, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var userId, friendId, user, friendAlreadyExists, friend;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                userId = _ref3.userId, friendId = _ref3.friendId;
                _context3.next = 3;
                return _connectors.UserModel.findOne({
                  where: {
                    id: userId
                  }
                });

              case 3:
                user = _context3.sent;
                _context3.next = 6;
                return user.getFriends({
                  where: {
                    id: friendId
                  }
                });

              case 6:
                friendAlreadyExists = _context3.sent;

                if (!(friendAlreadyExists.length === 0)) {
                  _context3.next = 9;
                  break;
                }

                throw new _apolloServer.ApolloError('user with that friendId is not friend', 404);

              case 9:
                _context3.next = 11;
                return _connectors.UserModel.findOne({
                  where: {
                    id: friendId
                  }
                });

              case 11:
                friend = _context3.sent;
                _context3.next = 14;
                return user.removeFriend(friend);

              case 14:
                return _context3.abrupt("return", user);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    addUserToGroup: function addUserToGroup(_, _ref4, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var groupId, userId, group, user, chat;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                groupId = _ref4.groupId, userId = _ref4.userId;
                _context4.next = 3;
                return _connectors.GroupModel.findOne({
                  where: {
                    id: groupId
                  }
                });

              case 3:
                group = _context4.sent;
                _context4.next = 6;
                return _connectors.UserModel.findOne({
                  where: {
                    id: userId
                  }
                });

              case 6:
                user = _context4.sent;
                _context4.next = 9;
                return group.getChat();

              case 9:
                chat = _context4.sent;
                _context4.next = 12;
                return user.addChat(chat);

              case 12:
                _context4.next = 14;
                return user.addGroup(group);

              case 14:
                return _context4.abrupt("return", user);

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    removeUserFromGroup: function removeUserFromGroup(_, _ref5, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var groupId, userId, group, users, isInTheUsers, user, chat;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                groupId = _ref5.groupId, userId = _ref5.userId;
                _context5.next = 3;
                return _connectors.GroupModel.findOne({
                  where: {
                    id: groupId
                  }
                });

              case 3:
                group = _context5.sent;

                if (!(group.ownerId === userId)) {
                  _context5.next = 6;
                  break;
                }

                throw new _apolloServer.ApolloError('owner can delete but not leave group', 404);

              case 6:
                _context5.next = 8;
                return group.getUsers();

              case 8:
                users = _context5.sent;
                isInTheUsers = users.map(function (user) {
                  return user.id;
                }).includes(userId);

                if (isInTheUsers) {
                  _context5.next = 12;
                  break;
                }

                throw new _apolloServer.ApolloError('user is not in the group', 404);

              case 12:
                _context5.next = 14;
                return _connectors.UserModel.findOne({
                  where: {
                    id: userId
                  }
                });

              case 14:
                user = _context5.sent;
                _context5.next = 17;
                return group.getChat();

              case 17:
                chat = _context5.sent;
                _context5.next = 20;
                return user.removeChat(chat);

              case 20:
                _context5.next = 22;
                return user.removeGroup(group);

              case 22:
                return _context5.abrupt("return", user);

              case 23:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    createDefaultGroup: function createDefaultGroup(_, _ref6, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var userId, contactId, existingDefaultGroup, chat, user, contact, group;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                userId = _ref6.userId, contactId = _ref6.contactId;
                _context6.next = 3;
                return _connectors.db.query("SELECT g.id FROM groups g, users u, groupuser gu\n          WHERE g.id = gu.groupId AND u.id = gu.userId \n          AND g.name = 'default' AND u.id = :userId\n          AND g.id IN \n          (SELECT g.id FROM groups g, users u, groupuser gu\n          WHERE g.id = gu.groupId AND u.id = gu.userId \n          AND g.name = 'default' AND u.id = :contactId)", {
                  replacements: {
                    userId: userId,
                    contactId: contactId
                  },
                  type: _sequelize["default"].QueryTypes.SELECT
                });

              case 3:
                existingDefaultGroup = _context6.sent;

                if (!(existingDefaultGroup.length > 0)) {
                  _context6.next = 6;
                  break;
                }

                return _context6.abrupt("return", _connectors.GroupModel.findOne({
                  where: {
                    id: existingDefaultGroup[0].id
                  }
                }));

              case 6:
                _context6.next = 8;
                return _connectors.ChatModel.create({});

              case 8:
                chat = _context6.sent;
                _context6.next = 11;
                return _connectors.UserModel.findOne({
                  where: {
                    id: userId
                  }
                });

              case 11:
                user = _context6.sent;
                _context6.next = 14;
                return _connectors.UserModel.findOne({
                  where: {
                    id: contactId
                  }
                });

              case 14:
                contact = _context6.sent;
                _context6.next = 17;
                return user.addChat(chat);

              case 17:
                _context6.next = 19;
                return contact.addChat(chat);

              case 19:
                _context6.next = 21;
                return _connectors.GroupModel.create({
                  name: 'default'
                });

              case 21:
                group = _context6.sent;
                _context6.next = 24;
                return chat.setGroup(group);

              case 24:
                _context6.next = 26;
                return user.addGroup(group);

              case 26:
                _context6.next = 28;
                return contact.addGroup(group);

              case 28:
                return _context6.abrupt("return", group);

              case 29:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    login: function login(_, _ref7, ctx) {
      var email = _ref7.email,
          password = _ref7.password;
      return _connectors.UserModel.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (user) {
          return _bcrypt["default"].compare(password, user.password).then(function (res) {
            if (res) {
              var token = _jsonwebtoken["default"].sign({
                id: user.id,
                email: user.email
              }, _config.JWT_SECRET);

              user.jwt = token;
              ctx.user = Promise.resolve(user);
              return user;
            }

            return Promise.reject('Invalid Credentials');
          });
        }

        return Promise.reject('Invalid Credentials');
      });
    },
    register: function register(_, _ref8, ctx) {
      var email = _ref8.email,
          password = _ref8.password,
          username = _ref8.username;
      return _connectors.UserModel.findOne({
        where: {
          email: email
        }
      }).then(function (existing) {
        if (!existing) {
          return _bcrypt["default"].hash(password, 10).then(function (hash) {
            return _connectors.UserModel.create({
              email: email,
              password: hash,
              username: username,
              avatar: _faker["default"].internet.avatar(),
              description: _faker["default"].lorem.sentences(3)
            });
          }).then(function (user) {
            var id = user.id;

            var token = _jsonwebtoken["default"].sign({
              id: id,
              email: email
            }, _config.JWT_SECRET);

            user.jwt = token;
            ctx.user = Promise.resolve(user);
            return user;
          });
        }

        return Promise.reject('email already exists'); // email already exists
      });
    },
    createMessage: function createMessage(_, _ref9) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var userId, groupId, text, group, chat, message;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                userId = _ref9.userId, groupId = _ref9.groupId, text = _ref9.text;
                _context7.next = 3;
                return _connectors.GroupModel.findOne({
                  where: {
                    id: groupId
                  }
                });

              case 3:
                group = _context7.sent;
                _context7.next = 6;
                return group.getChat();

              case 6:
                chat = _context7.sent;
                _context7.next = 9;
                return _connectors.MessageModel.create({
                  userId: userId,
                  chatId: chat.id,
                  text: text
                });

              case 9:
                message = _context7.sent;

                _subscriptions.pubsub.publish(MESSAGE_IN_GROUP_ADDED_TOPIC, _defineProperty({}, MESSAGE_IN_GROUP_ADDED_TOPIC, group));

                _subscriptions.pubsub.publish(MESSAGE_ADDED_TOPIC, _defineProperty({}, MESSAGE_ADDED_TOPIC, message));

                return _context7.abrupt("return", message);

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    },
    createGroup: function createGroup(_, _ref10) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var group, owner, chat, _group;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                group = _ref10.group;
                _context8.next = 3;
                return _connectors.UserModel.findOne({
                  where: {
                    id: group.ownerId
                  }
                });

              case 3:
                owner = _context8.sent;
                _context8.next = 6;
                return _connectors.ChatModel.create({});

              case 6:
                chat = _context8.sent;
                _context8.next = 9;
                return _connectors.GroupModel.create({
                  name: group.name,
                  avatar: group.avatarUrl,
                  description: group.description,
                  isPrivate: group.isPrivate
                });

              case 9:
                _group = _context8.sent;
                _context8.next = 12;
                return owner.addGroup(_group);

              case 12:
                _context8.next = 14;
                return _group.setOwner(owner);

              case 14:
                _context8.next = 16;
                return _group.addUser(owner);

              case 16:
                _context8.next = 18;
                return chat.addUser(owner);

              case 18:
                _context8.next = 20;
                return chat.setGroup(_group);

              case 20:
                _subscriptions.pubsub.publish(GROUP_ADDED_TOPIC, _defineProperty({}, GROUP_ADDED_TOPIC, _group));

                return _context8.abrupt("return", _group);

              case 22:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }))();
    },
    editGroup: function editGroup(_, _ref11) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var group, groupId, _group;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                group = _ref11.group, groupId = _ref11.groupId;
                _context9.next = 3;
                return _connectors.GroupModel.findOne({
                  where: {
                    id: groupId
                  }
                });

              case 3:
                _group = _context9.sent;
                _group.name = group.name;
                _group.avatar = group.avatarUrl;
                _group.description = group.description;
                _group.isPrivate = group.isPrivate;
                _context9.next = 10;
                return _group.save();

              case 10:
                return _context9.abrupt("return", _group);

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },
    deleteGroup: function deleteGroup(_, _ref12) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var groupId, group, users, bannedUsers, chat;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                groupId = _ref12.groupId;
                _context10.next = 3;
                return _connectors.GroupModel.findOne({
                  where: {
                    id: groupId
                  }
                });

              case 3:
                group = _context10.sent;
                _context10.next = 6;
                return group.getUsers();

              case 6:
                users = _context10.sent;
                _context10.next = 9;
                return group.getBannedUsers();

              case 9:
                bannedUsers = _context10.sent;
                _context10.next = 12;
                return group.getChat();

              case 12:
                chat = _context10.sent;
                _context10.next = 15;
                return group.removeBannedUsers(bannedUsers);

              case 15:
                _context10.next = 17;
                return group.removeUsers(users);

              case 17:
                _context10.next = 19;
                return chat.destroy();

              case 19:
                _context10.next = 21;
                return group.destroy();

              case 21:
                return _context10.abrupt("return", group);

              case 22:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }))();
    }
  },
  Query: {
    me: function me(_, args, _ref13) {
      var user = _ref13.user;
      return user;
    },
    chat: function chat(_, args, ctx) {
      return _logic.queryLogic.chat(_, args, ctx);
    },
    chats: function chats(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", _logic.queryLogic.chats(_, args, ctx));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }))();
    },
    group: function group(_, args, ctx) {
      return _logic.queryLogic.group(_, args, ctx);
    },
    groups: function groups(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", _logic.queryLogic.groups(_, args, ctx));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }))();
    },
    allGroups: function allGroups(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", _logic.queryLogic.allGroups(_, args, ctx));

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }))();
    },
    chatGroups: function chatGroups(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt("return", _logic.queryLogic.chatGroups(_, args, ctx));

              case 1:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }))();
    },
    users: function users(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", _logic.queryLogic.users(_, args, ctx));

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      }))();
    },
    friends: function friends(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.abrupt("return", _logic.queryLogic.friends(_, args, ctx));

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }))();
    },
    user: function user(_, args, ctx) {
      return _logic.queryLogic.user(_, args, ctx);
    },
    paginatedUsers: function paginatedUsers(_, args, ctx) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                return _context17.abrupt("return", _logic.queryLogic.paginatedUsers(_, args, ctx));

              case 1:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }))();
    }
  },
  //prouci apollo state
  //mutacija za chat
  //mutacija kreiraj chat, contact
  //paginacija za scroll, fetch more
  //subscribtions za chat i chats i contacts
  //auth
  //webrtc
  //accept, ignore chat request, block user
  //css za profile page, fab button start chat
  Chat: {
    users: function users(chat) {
      //sortiraj prema created at message, pa current user na kraj
      //da bi mogao user[0] na avatar
      return chat.getUsers();
    },
    messages: function messages(chat) {
      return _connectors.MessageModel.findAll({
        where: {
          chatId: chat.id
        },
        order: [['createdAt', 'DESC']]
      });
    },
    lastMessage: function lastMessage(chat) {
      return _connectors.MessageModel.findOne({
        where: {
          chatId: chat.id
        },
        order: [['createdAt', 'DESC']]
      });
    }
  },
  Group: {
    users: function users(group) {
      return group.getUsers();
    },
    bannedUsers: function bannedUsers(group) {
      return group.getBannedUsers();
    },
    owner: function owner(group) {
      return group.getOwner();
    },
    chat: function chat(group) {
      return group.getChat();
    }
  },
  Message: {
    from: function from(message) {
      return message.getUser();
    }
  },
  User: {
    chats: function chats(user, args, ctx) {
      return _logic.userLogic.chats(user, args, ctx);
    },
    friends: function friends(user, args, ctx) {
      return _logic.userLogic.friends(user, args, ctx);
    },
    groups: function groups(user, args, ctx) {
      return _logic.userLogic.groups(user, args, ctx);
    },
    jwt: function jwt(user, args, ctx) {
      return _logic.userLogic.jwt(user, args, ctx);
    }
  },
  PageInfo: {
    hasNextPage: function hasNextPage(connection, args, ctx) {
      return connection.hasNextPage();
    },
    cursor: function cursor(connection, args, ctx) {
      return connection.cursor();
    }
  }
};
exports.resolvers = resolvers;
var _default = resolvers;
/*
   async createMessage(_, { userId, chatId, text }) {
      const chat = await ChatModel.findOne({ where: { id: chatId } });
      console.log(chat);
      const message = await MessageModel.create({
        from: userId,
        text,
        createdAt: new Date(),
      });
      chat.messages.push(message);
      chat.lastMessage = message;
      await chat.save();
      return message;
    },
*/

/*
    async createGroup(_, { group }) {
      const owner = await UserModel.findOne({ where: { id: group.ownerId } });
      const chat = await ChatModel.create({});
      const _group = await GroupModel.create({
        name: group.name,
        avatar: group.avatarUrl,
        description: group.description,
      });
      await owner.addGroup(_group);
      await owner.setGroup(_group);
      await chat.setGroup(_group);
      pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: _group });
      return _group;
    },
*/

/*
(SELECT g.id FROM groups g, users u, groupuser gu
where g.id = gu."groupId" and u.id = gu."userId" 
and g.name = 'default' and u.id = 1)
intersect
(SELECT g.id FROM groups g, users u, groupuser gu
where g.id = gu."groupId" and u.id = gu."userId" 
and g.name = 'default' and u.id = 3)
*/

exports["default"] = _default;