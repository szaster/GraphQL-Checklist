import React from "react";
import ReactDOM from "react-dom";
// const { ApolloServer, gql } = require("apollo-server");
import App from "./App";
//instantiate a new client
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "https://close-cat-85.hasura.app/v1/graphql",
});

// client
//   .query({
//     query: gql`
//       query getTodos {
//         todos {
//           done
//           id
//           text
//         }
//       }
//     `,
//   })
//   .then((data) => console.log(data));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
