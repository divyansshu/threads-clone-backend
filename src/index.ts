import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prisma } from "./lib/db";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

async function init() {
  const gqlServer = new ApolloServer({
    typeDefs: `
    type Query {
        msg: String
    }
    type Mutation {
        createUser(
            firstName: String!,
            lastName: String!,
            email: String!,
            password: String!
            ): Boolean
    }
    `,
    resolvers: {
      Query: {
        msg: () => "hii there i am graphql server",
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string,
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    salt: "random_salt",
                },
            });
            return true;
        },
      },
    },
  });

  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.send("Hello");
  });

  app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
  });

  // Specify the path where we'd like to mount our server
  app.use("/graphql", expressMiddleware(gqlServer));
}

init();
