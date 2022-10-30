const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// import apollo server class
const { ApolloServer } = require('apollo-server-express');

// import graphql schema
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a new instance of apollo server with the graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };

// call the async function to start server
startApolloServer(typeDefs, resolvers);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
