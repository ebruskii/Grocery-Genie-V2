import {users} from '../config/mongoCollections.js'; // import collection
import {checkEmail, checkPassword, checkName, checkAge, checkId} from '../validation.js'
import {ObjectId} from 'mongodb';

const exportedMethods = {
  async getUserById(id) {
    id = checkId(id, 'ID');
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw `Error: User not found`;
    return user;
  },

  async addUser(
    email, 
    password, 
    firstName, 
    lastName, 
    age
    ) {
      // Error Checking
      email = checkEmail(email, 'Email Address');
      password = checkPassword(password, 'Password'); // password still need to be encrypted
      firstName = checkName(firstName, 'First Name');
      lastName = checkName(lastName, 'Last Name');
      age = checkAge(age, 'Age');
      
      // Check that Email is Not Already In Use
      const userCollection = await users();
      const existingEmail = await userCollection.find({email: email}).toArray();
      if (existingEmail.length !== 0) throw `Error: Email is already in use`;

      let householdName = "";
      let groceryLists = [];
      let announcements = [];
      let comments = [];
      let shopper = false;
      const newUser = {
        email, 
        password, 
        firstName, 
        lastName, 
        age,
        householdName,
        groceryLists,
        announcements,
        comments,
        shopper
      };

      // Add New User
      const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error: Could not add user';
      newUser._id = newUser._id.toString(); // convert to string
      return newUser;
  },

  async logInUser (email, password) {
    email = checkEmail(email, "Email Address");

    // Check email is in use
    const userCollection = await users();
    const user = await userCollection.find({email: email}).toArray();
    if (user.length === 0) throw `Error: No email exists with that login`;
    
    // decrypt password before comparison
    // existingEmail.password -> decrypt
    if (!user.password === password) throw `Error: Incorrect Password`;

    // return all info about user
    return user[0];
  },

  async getAllUsers () {
    const userCollection = await users();
    let userList = await userCollection
    .find({})
    .project({_id: 0, firstName: 1, lastName: 1})   // just return the name of the users w project
    .toArray();
    if (!userList) {
      throw `Could not get all users`
    }
    let members = [];
    userList.forEach((object) => {
      members.push(object.firstName + " " + object.lastName);
    });
    // Returns list of members: [firstName lastName, firstName lastName]
    return members;
  },

  async updateUser(
    email, 
    password, 
    firstName, 
    lastName, 
    age
    ) {
      // Error Checking
      email = checkEmail(email, 'Email Address');
      password = checkPassword(password, 'Password');
      firstName = checkName(firstName, 'First Name');
      lastName = checkName(lastName, 'Last Name');
      age = checkAge(age, 'Age');
    return;
  }
  
  };
  export default exportedMethods;