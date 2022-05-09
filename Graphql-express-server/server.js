import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';
import {mongoose}  from 'mongoose';

const PORT = 9000;


const app = express();


const typeDefs = await readFile('./schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
apolloServer.applyMiddleware({ app, path: '/graphql' });

// Mongoose connection over atlas database
// uncomment below code to save the data in atlas database

// mongoose.connect('mongodb+srv://<Username>:<password>@cluster0.zbp60.mongodb.net/epaisa?retryWrites=true&w=majority'),{
//   useUnifiedTopology: true,
//   useNewUrlParser: true,

// }

// Mongoose connection over localhost

mongoose.connect("mongodb://localhost:27017/epaisa", {
  useNewUrlParser: "true",
})
mongoose.connection.once("open", () => {
	console.log("Connected to database");
});


// Api endpoint
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
