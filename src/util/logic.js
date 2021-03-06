import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import Sequelize from 'sequelize';
import {
  MessageModel,
  UserModel,
  GroupModel,
  ChatModel,
} from '../data/connectors';

const Op = Sequelize.Op;

// reusable function to check for a user with context
function getAuthenticatedUser(ctx) {
  // return UserModel.findOne({ where: { id: 1 } });

  return ctx.user.then((user) => {
    if (!user) {
      throw new AuthenticationError('Unauthenticated');
    }
    return user;
  });
}

async function isUserAuth(userId, ctx) {
  const authUser = await getAuthenticatedUser(ctx);
  if (authUser.id !== userId) {
    throw new ForbiddenError('Unauthorized');
  }
  return authUser;
}

export const mutationLogic = {
  async createMessage(_, { text, chatId }, ctx) {
    const user = await getAuthenticatedUser(ctx);
    return MessageModel.create({
      userId: user.id,
      chatId,
      text,
    });
  },
};

export const queryLogic = {
  async chat(_, args, ctx) {
    //if authUser belongs in that chat
    const authUser = await getAuthenticatedUser(ctx);
    const chatIds = await authUser
      .getChats({
        attributes: ['id'],
      })
      .map((chat) => chat.id);
    const isInTheChat = chatIds.find((id) => id === args.chatId);
    if (isInTheChat) {
      return ChatModel.findOne({ where: { id: args.chatId } });
    }
    throw new ForbiddenError('Unauthorized');
  },
  async chats(_, args, ctx) {
    const authUser = await isUserAuth(args.userId, ctx);
    return authUser.getChats();
  },
  async group(_, args, ctx) {
    return GroupModel.findOne({ where: { id: args.groupId } });
  },
  async groups(_, args, ctx) {
    const authUser = await isUserAuth(args.userId, ctx);
    return authUser.getGroups({ where: { name: { [Op.not]: 'default' } } });
  },
  async allGroups(_, args, ctx) {
    return GroupModel.findAll({
      where: { name: { [Op.not]: 'default' }, isPrivate: false },
    });
  },
  async chatGroups(_, args, ctx) {
    const authUser = await isUserAuth(args.userId, ctx);
    return authUser.getGroups();
  },
  async users(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    const users = UserModel.findAll({
      where: { id: { [Op.not]: user.id } },
    });
    return users;
  },
  async friends(_, args, ctx) {
    const authUser = await isUserAuth(args.id, ctx);
    return authUser.getFriends();
  },
  async user(_, args, ctx) {
    //everyone can see everyones profile
    const where = args.id ? { id: args.id } : { email: args.email };
    const user = await UserModel.findOne({
      where: where,
    });
    return user;
  },
  async paginatedUsers(_, { first, after }, ctx) {
    const authUser = await getAuthenticatedUser(ctx);
    let where;
    if (after) {
      where = {
        [Op.and]: [
          { id: { [Op.gt]: after } },
          { id: { [Op.ne]: authUser.id } },
        ],
      };
    } else {
      const firstUser = await UserModel.findOne({
        where: { id: { [Op.ne]: authUser.id } },
        order: [['id', 'ASC']],
      });
      where = {
        [Op.and]: [
          { id: { [Op.gte]: firstUser.id } },
          { id: { [Op.ne]: authUser.id } },
        ],
      };
    }

    const users = await UserModel.findAll({
      where,
      order: [['id', 'ASC']],
      limit: first,
    });

    const edges = users.map((user) => ({
      node: user,
    }));

    let hasNextPage, cursor;
    cursor = users[users.length - 1].id; //last elem id
    if (users.length < first) {
      hasNextPage = false;
    } else {
      const user = await UserModel.findOne({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.gt]: users[users.length - 1].id,
              },
            },
            { id: { [Op.ne]: authUser.id } },
          ],
        },
        order: [['id', 'ASC']],
      });
      hasNextPage = !!user;
    }
    const pageInfo = {
      hasNextPage() {
        return hasNextPage;
      },
      cursor() {
        return cursor;
      },
    };
    return {
      edges,
      pageInfo,
    };
  },
};

export const userLogic = {
  async chats(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getChats();
  },
  async friends(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getFriends();
  },
  async groups(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getGroups();
  },
  jwt(user, args, ctx) {
    return Promise.resolve(user.jwt);
  },
};
