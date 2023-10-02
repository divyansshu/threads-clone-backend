import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createGraphQlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
    ${User.typeDefs}
    
    type Query {
        ${User.queries}
    }
    type Mutation {
      ${User.mutations}
    }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await gqlServer.start();

  return gqlServer;
}

export default createGraphQlServer;
