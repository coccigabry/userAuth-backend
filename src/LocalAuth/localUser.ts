import mongoose from 'mongoose';


const localuser = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
});


export default mongoose.model("localUser", localuser);
