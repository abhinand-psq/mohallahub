import  mongoose ,{ Schema} from 'mongoose'



const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  desc: {
    type: String,
    trim:true,
    maxlength: 255,
    require:true
  },
  img:{
    type:String,
    default:null
  },
  video:{
    type:String,
    default:null
  },
  title:{
    type:String,
     trim:true,
    maxlength: 25,
    require:true
  },
  isSensitive: {
    type: Boolean,
    default: false,
  },

  // RELATIONS
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,},
community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
  rePost: {type: mongoose.Schema.Types.ObjectId,ref: "Post",default: null,},
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],

  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedPost",
    },
  ],
});


const commentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

//   parentComment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Comment", // supports threaded replies
//     default: null,
//   },
});


const likeSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // RELATIONS
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

likeSchema.index({ user: 1, post: 1 }, { unique: true });



const savedPostSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // RELATIONS
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

savedPostSchema.index({ user: 1, post: 1 }, { unique: true });

export const SavedPost =  mongoose.model("SavedPost", savedPostSchema);

export const Like =  mongoose.model("Like", likeSchema);

export const Commment = mongoose.model("Comment", commentSchema);

export const post =  mongoose.model("Post", postSchema);
