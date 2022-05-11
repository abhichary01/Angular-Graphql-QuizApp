import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';
import {mongoose}  from 'mongoose';

// Declaring fixed port the server will run on this port
const PORT = 9000;

// Express is middle ware to interact with graphql server and intervene 
// with various HTTPS and URLS
const app = express();

/*
Server takes typeDefs as input to find and validate schema
readFile module directs to the path where all schema is located
*/
const typeDefs = await readFile('./schema.graphql', 'utf-8');



const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();


// Using express we can extend url to any endpoint we want
apolloServer.applyMiddleware({ app, path: '/graphql' });

// Mongoose connection over atlas database
// uncomment below code to save the data in atlas database

// mongoose.connect('mongodb+srv://abhishek:7OaBOJR5C4RZmd2I@cluster0.zbp60.mongodb.net/epaisa?retryWrites=true&w=majority'),{
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
