"use strict";

var _mocks = require("./data/mocks");

var _apolloServer = require("apollo-server");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _schema = require("./graphql/schema");

var _resolvers = require("./graphql/resolvers");

var _config = require("./config");

var _connectors = require("./data/connectors");

var _AuthService = _interopRequireDefault(require("./util/AuthService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var server = new _apolloServer.ApolloServer({
  cors: false,
  typeDefs: _schema.typeDefs,
  resolvers: _resolvers.resolvers,
  context: function context(_ref) {
    var req = _ref.req,
        connection = _ref.connection;

    if (connection) {
      return {};
    }

    var tokenParsedData = _AuthService["default"].getUser(req);

    var user = new Promise(function (resolve, reject) {
      if (tokenParsedData.id) {
        resolve(_connectors.UserModel.findOne({
          where: {
            id: tokenParsedData.id
          }
        }));
      } else {
        resolve(null);
      }
    }); // user.then((data) => console.log(data));

    return {
      user: user
    };
  }
});
var port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 80;
}

server.listen(port).then(function (_ref2) {
  var url = _ref2.url,
      subscriptionsUrl = _ref2.subscriptionsUrl;
  console.log("\uD83D\uDE80 Apollo server ready on ".concat(url));
  console.log("\uD83D\uDE80 Subscriptions ready at ".concat(subscriptionsUrl));
});