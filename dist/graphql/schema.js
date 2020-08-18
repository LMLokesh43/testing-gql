"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.typeDefs = void 0;

var _apolloServer = require("apollo-server");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  # declare custom scalars\n  scalar Date\n\n  type User {\n    id: Int!\n    email: String!\n    username: String\n    avatar: String\n    description: String\n    chats: [Chat]\n    friends: [User]\n    groups: [Group]\n    lastActiveAt: Date\n    jwt: String\n  }\n\n  type Chat {\n    id: Int!\n    messages: [Message]\n    users: [User]!\n    lastMessage: Message\n    createdAt: Date!\n    updatedAt: Date!\n  }\n\n  type Group {\n    id: Int!\n    name: String\n    avatar: String\n    description: String\n    owner: User\n    users: [User]\n    bannedUsers: [User]\n    chat: Chat\n    isPrivate: Boolean\n    createdAt: Date!\n    updatedAt: Date!\n  }\n\n  type Message {\n    id: Int!\n    from: User!\n    text: String!\n    createdAt: Date!\n  }\n\n  input CreateGroupInput {\n    name: String!\n    avatarUrl: String!\n    description: String!\n    ownerId: Int!\n    isPrivate: Boolean!\n  }\n\n  # ======= pagination =========\n\n  type UserConnection {\n    edges: [UserEdge]\n    pageInfo: PageInfo!\n  }\n\n  type UserEdge {\n    node: User!\n  }\n\n  type PageInfo {\n    cursor: Int!\n    hasNextPage: Boolean!\n  }\n  #======= /pagination =========\n\n  type Query {\n    me: User\n    user(email: String, id: Int): User\n    users(id: Int!): [User]\n    paginatedUsers(first: Int, after: Int): UserConnection\n    friends(id: Int!): [User]\n    chat(chatId: Int!): Chat\n    chats(userId: Int!): [Chat]\n    group(groupId: Int!): Group\n    groups(userId: Int!): [Group]\n    allGroups: [Group]\n    chatGroups(userId: Int!): [Group]\n  }\n\n  type Mutation {\n    createMessage(userId: Int!, groupId: Int!, text: String!): Message\n    login(email: String!, password: String!): User\n    register(username: String!, email: String!, password: String!): User\n    createDefaultGroup(userId: Int!, contactId: Int!): Group\n    createGroup(group: CreateGroupInput!): Group\n    editGroup(groupId: Int!, group: CreateGroupInput!): Group\n    addUserToGroup(groupId: Int!, userId: Int!): User\n    removeUserFromGroup(groupId: Int!, userId: Int!): User\n    deleteGroup(groupId: Int!): Group\n    addFriend(userId: Int!, friendId: Int!): User\n    removeFriend(userId: Int!, friendId: Int!): User\n  }\n\n  type Subscription {\n    messageAdded(groupId: Int!): Message\n    groupAdded(userId: Int!): Group\n    messageInGroupAdded(userId: Int!): Group\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServer.gql)(_templateObject());
exports.typeDefs = typeDefs;
var _default = typeDefs;
exports["default"] = _default;