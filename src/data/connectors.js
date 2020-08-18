import Sequelize from 'sequelize';
import { _ } from 'lodash';
import seed from './seed';
import { PROD_DB as DATABASE } from '../config';

export const db = new Sequelize(
  // 'rn_chat',
  // 'root',
  // 'root',
  // DATABASE.database,
  // DATABASE.username,
  // DATABASE.password,
  // 'postgres://postgres:root@localhost:5432/chat',
  `mysql://${DATABASE.username}:${DATABASE.password}@${DATABASE.host}:${DATABASE.port}/${DATABASE.database}`,
  {
    logging: false,
  },
);

// tabele, osnovni tipovi od kojih su sacinjeni ostali iz graphql scheme

export const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
  lastActiveAt: { type: Sequelize.DATE },
  password: { type: Sequelize.STRING },
});

export const ChatModel = db.define('chat', {});

export const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  isPrivate: { type: Sequelize.BOOLEAN },
});

export const MessageModel = db.define('message', {
  text: { type: Sequelize.TEXT },
});

UserModel.belongsToMany(ChatModel, { through: 'ChatUser' });
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
MessageModel.belongsTo(UserModel);
UserModel.hasOne(MessageModel);

ChatModel.belongsToMany(UserModel, { through: 'ChatUser' });

MessageModel.belongsTo(ChatModel);
ChatModel.hasMany(MessageModel);

GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });

UserModel.belongsToMany(GroupModel, {
  through: 'BannedGroupUser',
  as: 'bannedUsers',
});
GroupModel.belongsToMany(UserModel, {
  through: 'BannedGroupUser',
  as: 'bannedUsers',
});

GroupModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'ownerId',
  targetKey: 'id',
});
UserModel.hasOne(GroupModel, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
ChatModel.belongsTo(GroupModel);
GroupModel.hasOne(ChatModel);

// db.sync({ force: true })
//   .then(async () => await seed())
//   .catch((error) => console.log(error));
