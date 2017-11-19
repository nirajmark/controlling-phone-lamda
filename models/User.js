const mongoose = require('mongoose');
const { Schema } = mongoose; // const Schema = mongoose.Schema; (equivalent)

const userSchema = new Schema ({
  firebaseId : String,
  email : String,
  gcmToken : String
});

mongoose.model('users',userSchema);
