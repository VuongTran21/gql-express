var express = require('express');
var expressGraphQL = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        author(authorId: Int!): Author
        authors: [Author]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    },
    type Course {
        id: Int,
        title: String,
        author: String,
        description: String,
        topic: String,
        url: String
    },
    type Author {
        id: Int,
        name: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 1,
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 1,
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 2,
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

var authorsData = [
    {
        id: 1,
        name: 'Andrew Mead'
    },
    {
        id: 2,
        name: 'Brad Traversy'
    },
    {
        id: 3,
        name: 'Rob Percival'
    },
    {
        id: 4,
        name: 'Anthony Alicea'
    }
];

var getAuthor = function({authorId}) {
    return authorsData.filter(author => author.id === authorId)[0];
}

var getAuthors = function() {
    return authorsData;
}

var getCourse = function(args) {
    var id = args.id;

    return coursesData.filter(course => {
        return course.id === id
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (id === course.id) {
            course.topic = topic;

            return course;
        }
    });

    return coursesData.filter(course => course.id === id)[0];
}

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic,
    author: getAuthor,
    authors: getAuthors
};

// Create an express server and a GraphQL endpoint
var app = express();
var PORT = process.env.PORT || 4000;
app.use('/graphql', expressGraphQL({
    schema,
    rootValue: root,
    graphiql: true
}));
app.listen(PORT, () => console.log('Express GraphQL server now is running on port: ', PORT));