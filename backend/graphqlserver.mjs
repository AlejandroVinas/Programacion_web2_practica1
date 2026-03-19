import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import express from 'express';
import { ruruHTML } from 'ruru/server';
 
// Serve the GraphiQL IDE.

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`type Query { hello: String } `);
 
// The root provides a resolver function for each API endpoint
const root = {
  hello() {
    return 'Hello world!';
  },
};
 
const app = express();
 
// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
}); 

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
