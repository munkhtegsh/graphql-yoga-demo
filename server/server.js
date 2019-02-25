const {GraphQLServer} = require('graphql-yoga');

// setting up some dummy data for users and posts
const users = [
  {
    id: '1',
    name: 'Andres',
    password: 'jkfdsjfssd',
  },
  {
    id: '2',
    name: 'Jena',
    password: 'erewwaq',
  },
];

const posts = [
  {
    id: '10',
    title: 'Dragon ball',
    body: 'Blalallalala ....',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'A Game day',
    body: 'Wooohooo....',
    published: false,
    author: '2',
  },
];

// Schemas
const typeDefs = `
  type Query {
    me: User!
    users(query: String): [User]!
    posts(query: String): [Post]!
  },

  type User {
    id: ID!,
    name: String!
    password: String!
  },

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
    author: User!
  }
`;

// resolvers
const resolvers = {
  Query: {
    me: (parent, args, context, info) => ({
      id: 1,
      name: 'Potter',
      password: 'Secre1',
    }),
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      return users.filter(user => user.name.toLowerCase().includes(args.query));
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post =>
        post.title.toLowerCase().includes(args.query),
      );
    },
  },

  Post: {
    // handling relation between posts and users with author
    author(parent, args) {
      return users.find(user => user.id === parent.author);
    },
  },
};

const options = {
  port: 4002,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

const server = new GraphQLServer({typeDefs, resolvers});

server.start(options, ({port}) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  ),
);
