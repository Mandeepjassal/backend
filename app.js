//console.log("welcome");

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Error, Query } from "mongoose";
import eatToastModel from "./models/EatToastModel.js";
import productModel from "./models/ProductModel.js";
import ProductModel from "./models/ProductModel.js";
import UsersModel from "./models/UsersModel.js";
import bcrypt from "bcrypt";
const typeDefs = `
type User{
  _id: ID,
  Firstname: String,
  Lastname: String,
  email: String,
  Address: String,
  Mobile: Int,
  Password: String,
  Usertype: UserType,
}
input UserInput{
  Firstname: String,
  Lastname: String,
  email: String,
  Address: String,
  Password: String,
  Mobile: Int,
  Usertype: UserType,
}
enum UserType{
  ADMIN
  MANAGER
  EMPLOYEE
}

type Category{
    _id:ID,
    category_name : String
}

type CategoryInfo{
  
  category_name : String
}

type Products{
  _id: ID,
  Product_name: String,
  Product_price: Float,
  Product_description: String,
  Product_image: String,
  Category: String
}

input ProductDetails
{
  Product_name: String,
  Product_price: Float,
  Product_description: String,
  Product_image: String,
  Category: String
}

input CategoryList
{
  category_name : String
}



type Query{
    getAllCategory_db: [Category]
    
    getAllProducts_db: [Products]
    getCategoryById_db(cat_id:ID) : Category
    getProductById_db(pro_id:ID) : Products
    getAllUsers_db: [User]
    checkExistingUser (email: String, Usertype: UserType) : [User]
}

type Mutation{
  createProducts(productInput: ProductDetails): Products
  db_updateProductById(pro_id:ID,updated_data :ProductDetails): Products
  db_deleteProductById(pro_id:ID):Products

  insertCategories(categoryInsert: CategoryList): Category
  db_updateCategoryById(cat_id:ID,updated_data :CategoryList): Category
  db_deleteCategoryById(cat_id:ID):Category

  signupUser(userInput: UserInput): User
  
  checkExistingUser(email: String!, Password:String!, Usertype: UserType!): User
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

    getAllProducts_db: async (parent, args, context, info) => {
      try {
        const products_from_db = await productModel.find({});

        console.log(parent);
        console.log(products_from_db);

        return products_from_db;
      } catch (err) {
        console.log(err);
      }
    },
    getCategoryById_db: async (parent, args, context, info) => {
      try {
        console.log(parent);
        const id = args.cat_id;

        console.log(id);

        const category_from_db = await eatToastModel.findById(id);

        console.log(category_from_db);

        return category_from_db;
      } catch (err) {
        console.log(
          `getCategoryById_db Failed due to the erroe below \n ${err}`
        );
      }
    },
    getProductById_db: async (parent, args, context, info) => {
      try {
        console.log(parent);
        const id = args.pro_id;

        console.log(id);

        const product_from_db = await productModel.findById(id);

        console.log(product_from_db);

        return product_from_db;
      } catch (err) {
        console.log(err);
      }
    },
    getAllUsers_db: async (parent, args, context, info) => {
      try {
        const users_from_db = await UsersModel.find({});

        console.log(parent);
        console.log(users_from_db);

        return users_from_db;
      } catch (err) {
        console.log(err);
      }
    },

    checkExistingUser: async (parent, args, context, info) => {
      try {
        const { email, Usertype } = args;
        const existingUser = await UsersModel.find({ email, Usertype });
        return existingUser;
      } catch (err) {
        console.log(err);
      }
    },
  },

  Mutation: {
    createProducts: async (parent, args, context, info) => {
      try {
        const newProducts = new productModel(args.productInput);

        const savedProducts = await newProducts.save();
        console.log(newProducts);
        return savedProducts;
      } catch (err) {
        console.log(err);
      }
    },
    db_deleteProductById: async (parent, args, context, info) => {
      try {
        const id = args.pro_id;

        const product_deleted = await ProductModel.findByIdAndDelete(id);

        console.log(product_deleted);

        return product_deleted;
      } catch (err) {
        console.log(`Delete Failed due to the error below \n ${err}`);
      }
    },
    db_updateProductById: async (parent, args, context, info) => {
      try {
        const id = args.pro_id;

        const updated_pro = args.updated_data;

        const updated_pro_from_db = await productModel.findByIdAndUpdate(
          id,
          updated_pro
        );

        console.log(updated_pro);

        return updated_pro;
      } catch (err) {
        console.log(`Update Failed due to the error below \n ${err}`);
      }
    },
    insertCategories: async (parent, args, context, info) => {
      try {
        const newCategory = new eatToastModel(args.categoryInsert);

        const savedCategories = await newCategory.save();
        console.log(newCategory);
        return savedCategories;
      } catch (err) {
        console.log(err);
      }
    },
    db_deleteCategoryById: async (parent, args, context, info) => {
      try {
        const id = args.cat_id;

        const category_deleted = await eatToastModel.findByIdAndDelete(id);

        console.log(category_deleted);

        return category_deleted;
      } catch (err) {
        console.log(`Delete Failed due to the error below \n ${err}`);
      }
    },
    db_updateCategoryById: async (parent, args, context, info) => {
      try {
        const id = args.cat_id;

        const updated_cat = args.updated_data;

        const updated_cat_from_db = await eatToastModel.findByIdAndUpdate(
          id,
          updated_cat
        );

        console.log(updated_cat);

        return updated_cat;
      } catch (err) {
        console.log(`Update Failed due to the error below \n ${err}`);
      }
    },
    signupUser: async (parent, args, context, info) => {
      try {
        if (!args.userInput) {
          throw new Error("User input data is missing.");
        }
        const { email, Usertype } = args.userInput;
        // Check for existing user with the same email and usertype
        const existingUser = await UsersModel.findOne({ email, Usertype });

        if (existingUser) {
          // Throw an error if the user already exists with the same email and usertype
          throw new Error(
            "User with the provided email and usertype already exists."
          );
        }

        const salt = 15;
        const hashedPassword = await bcrypt.hash(args.userInput.Password, salt);

        // If no existing user found, proceed with user creation logic
        const newUser = new UsersModel({
          ...args.userInput,
          Password: hashedPassword,
        });

        const saveduser = await newUser.save();

        return saveduser;
      } catch (error) {
        throw error; // Rethrow the error to be caught by Apollo Server and returned to the client
      }
    },

    checkExistingUser: async (parent, args, context, info) => {
      try {
        const { email, Usertype, Password } = args;
        const logexistingUser = await UsersModel.findOne({ email, Usertype });

        if (!logexistingUser) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          Password,
          logexistingUser.Password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return logexistingUser;
      } catch (error) {
        throw error;
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      requestDidStart: () => ({
        willSendResponse: ({ response }) => {
          if (response.http) {
            response.http.headers.set(
              "Access-Control-Allow-Origin",
              "http://localhost:3000"
            ); // Update with your client origin
          }
        },
      }),
    },
  ],
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 6002 },
});

console.log(`🚀  Server ready at: ${url}`);
