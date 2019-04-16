var express = require('express');
var expressGraphQL = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);

// Root resolver
var root = {
    message: () => 'Hello World!'
};

// Create express server and GraphQL endpoint
var app = express();
var PORT = process.env.PORT || 4000;
app.use('/graphql', expressGraphQL({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(PORT, () => console.log('Express GraphQL server now is running on port: ', PORT));