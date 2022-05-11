import { Questions } from './db.js';
import {User} from './model/User.js'

// Resolvers are to get or edit the data from our datastore
export const resolvers = {
  // Code section to query/fetch the apis
  Query: {
    // Api to get questions
    questions: () => Questions.findAll(),

    // API to get user details
    getUser: async (_, args) => {
      try {
        const { userID } = args;
        return await User.findById(userID);
      } catch (error) {
        throw new Error(error);
      }
    },

    // API to get all users data
    getUsers: async (_, args) => {
      try {
        return await User.find();
      } catch (error) {
        throw new Error(error);
      }
    },

  },

 
    // Code section to make changes in the apis Below are CRUD operation for user details
  Mutation: {
    createUser: async (_, args) => {
      try {
        const { userInput } = args;
        console.log(userInput);

        return await User.create(userInput);
      } catch (error) {
        throw new Error(error);
      }
    },

  }
}