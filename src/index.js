import { mocks } from './data/mocks';
import { ApolloServer, gql } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { JWT_SECRET } from './config';
import { UserModel } from './data/connectors';
import AuthService from './util/AuthService';

const server = new ApolloServer({
  cors: false,
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      return {};
    }
    const tokenParsedData = AuthService.getUser(req);
    const user = new Promise((resolve, reject) => {
      if (tokenParsedData.id) {
        resolve(UserModel.findOne({ where: { id: tokenParsedData.id } }));
      } else {
        resolve(null);
      }
    });

    // user.then((data) => console.log(data));
    return { user };
  },
});

let port = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 80;
}

server.listen(port).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Apollo server ready on ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
