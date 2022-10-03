import mongoose from 'mongoose';


const oauthuser = new mongoose.Schema({
  googleId: {
    required: false,
    type: String
  },
  facebookId: {
    required: false,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});


export default mongoose.model("oauthUser", oauthuser);
