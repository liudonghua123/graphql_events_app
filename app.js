const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

// env variables from .env file recognized
const dotenv = require("dotenv");
dotenv.config();

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(cors())

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

const port = process.env.PORT || 4001;

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log(
        "\nServer App started at: \n- Local:",
        "\x1b[36m",
        `\thttp://localhost:${port}/graphql`,
        "\x1b[0m",
        "\n\nFor database we use Cloud wersion of MongoDB \n- Atlas:",
        "\x1b[92m",
        "\thttps://cloud.mongodb.com\n",
        "\x1b[0m"
      );
    });
  })
  .catch(err => {
    console.error(err);
  });
