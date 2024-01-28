//console.log("welcome");

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Error, Query } from "mongoose";
import eatToastModel from "./models/EatToastModel.js";
const typeDefs = `
type Category{
    _id:ID,
    category_name : String
}

type CategoryInfo{
  
    category_name : String
}

type Query{
    getAllCategory_db: [Category]
}


`;

const resolvers = {
  Query: {
    getAllCategory_db: async (parent, args, context, info) => {
      try {
        const categories_from_db = await eatToastModel.find({});

        console.log(parent);
        console.log(categories_from_db);

        return categories_from_db;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 6001 },
});

console.log(`🚀  Server ready at: ${url}`);
