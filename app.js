const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['query'] : ['query', 'info', 'warn', 'error']
});

const typeDefs = gql`
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    password: String
  }

  type User {
    id: ID!
    username: String
    email: String
    messages: [Message!]!
  }

  type Message {
    id: ID!
    authorId: ID!
    body: String
  }

  type Query {
    users(limit: Int): [User],
    user(id: ID!): User
    userByUsername(username: String!): User
    userByEmail(username: String!): User

    getUserMessages(id: ID!): [Message]
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    loginUser(email: String!, password: String!): User
    updateUser(id: ID!, input: UpdateUserInput): User
    deleteUser(id: ID!): User

    createMessage(authorId: ID!, body: String!): Message
    deleteMessage(id: ID!): Message
  }
`;

const resolvers = {
  Query: {
    users: async (_, { limit }) => {
      return await prisma.user.findMany({
        take: limit || 100,
        include: {
          messages: true
        }
      });
    },

    user: async (_, { id }) => {
      return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          messages: true
        }
      })
    },

    userByEmail: async (_, { email }) => {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          messages: true
        }
      })
    },

    userByUsername: async (_, { username }) => {
      return await prisma.user.findUnique({
        where: { username },
        include: {
          messages: true
        }
      })
    },

    getUserMessages: async (_, { id }) => {
      return await prisma.message.findMany({
        where: { authorId: parseInt(id) }
      });
    }
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { password, ...userParams } = input;
      userParams.passwordHash = await bcrypt.hash(password, 10);

      return await prisma.user.create({
        data: userParams,
      });
    },

    loginUser: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          messages: true
        }
      });
      if (!user) throw new Error('Invalid email and/or password');

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new Error('Invalid email and/or password');

      return user;
    },

    updateUser: async (_, { id, input }) => {
      const { password, ...userParams } = input;
      if (password) {
        userParams.passwordHash = await bcrypt.hash(password, 10);
      }

      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: userParams
      });
    },

    deleteUser: async (_, { id }) => {
      return await prisma.user.delete({
        where: { id: parseInt(id) }
      });
    },

    createMessage: async (_, { authorId, body }) => {
      return await prisma.message.create({
        data: {
          body,
          author: {
            connect: {
              id: parseInt(authorId)
            }
          }
        },
      });
    },

    deleteMessage: async (_, { id }) => {
      return await prisma.message.delete({
        where: { id: parseInt(id) }
      });
    },
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
