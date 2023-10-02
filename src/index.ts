import express from "express";
import { expressMiddleware } from "@apollo/server/express4";

import createGraphQlServer from "./graphql";
import userServices from "./services/userService";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

async function init() {
  const gqlServer = await createGraphQlServer();

  // Specify the path where we'd like to mount our server
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {     
          const user = userServices.decodeJwtToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.get("/", (req, res) => {
    res.send("Hello");
  });

  app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
  });
}

init();
