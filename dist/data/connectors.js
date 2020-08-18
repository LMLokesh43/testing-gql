"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageModel = exports.GroupModel = exports.ChatModel = exports.UserModel = exports.db = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _lodash = require("lodash");

var _seed = _interopRequireDefault(require("./seed"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var db = new _sequelize["default"]( // 'rn_chat',
// 'root',
// 'root',
// DATABASE.database,
// DATABASE.username,
// DATABASE.password,
// 'postgres://postgres:root@localhost:5432/chat',
"mysql://".concat(_config.PROD_DB.username, ":").concat(_config.PROD_DB.password, "@").concat(_config.PROD_DB.host, ":").concat(_config.PROD_DB.port, "/").concat(_config.PROD_DB.database), {
  logging: false
}); // tabele, osnovni tipovi od kojih su sacinjeni ostali iz graphql scheme

exports.db = db;
var UserModel = db.define('user', {
  email: {
    type: _sequelize["default"].STRING
  },
  username: {
    type: _sequelize["default"].STRING
  },
  avatar: {
    type: _sequelize["default"].STRING
  },
  description: {
    type: _sequelize["default"].TEXT
  },
  lastActiveAt: {
    type: _sequelize["default"].DATE
  },
  password: {
    type: _sequelize["default"].STRING
  }
});
exports.UserModel = UserModel;
var ChatModel = db.define('chat', {});
exports.ChatModel = ChatModel;
var GroupModel = db.define('group', {
  name: {
    type: _sequelize["default"].STRING
  },
  avatar: {
    type: _sequelize["default"].STRING
  },
  description: {
    type: _sequelize["default"].STRING
  },
  isPrivate: {
    type: _sequelize["default"].BOOLEAN
  }
});
exports.GroupModel = GroupModel;
var MessageModel = db.define('message', {
  text: {
    type: _sequelize["default"].TEXT
  }
});
exports.MessageModel = MessageModel;
UserModel.belongsToMany(ChatModel, {
  through: 'ChatUser'
});
UserModel.belongsToMany(UserModel, {
  through: 'Friends',
  as: 'friends'
});
MessageModel.belongsTo(UserModel);
UserModel.hasOne(MessageModel);
ChatModel.belongsToMany(UserModel, {
  through: 'ChatUser'
});
MessageModel.belongsTo(ChatModel);
ChatModel.hasMany(MessageModel);
GroupModel.belongsToMany(UserModel, {
  through: 'GroupUser'
});
UserModel.belongsToMany(GroupModel, {
  through: 'GroupUser'
});
UserModel.belongsToMany(GroupModel, {
  through: 'BannedGroupUser',
  as: 'bannedUsers'
});
GroupModel.belongsToMany(UserModel, {
  through: 'BannedGroupUser',
  as: 'bannedUsers'
});
GroupModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'ownerId',
  targetKey: 'id'
});
UserModel.hasOne(GroupModel, {
  foreignKey: 'ownerId',
  sourceKey: 'id'
});
ChatModel.belongsTo(GroupModel);
GroupModel.hasOne(ChatModel); // db.sync({ force: true })
//   .then(async () => await seed())
//   .catch((error) => console.log(error));