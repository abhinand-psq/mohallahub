import mongoose,{Schema} from 'mongoose'

const communitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String }, 
    banner: { type: String },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    rules: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
     hierarchy: {type: mongoose.Schema.Types.ObjectId,ref: "UserCommunityAccess",required: true,},
   members: [{type: mongoose.Schema.Types.ObjectId,ref: "User"}],
  },
  { timestamps: true }
);


import mongoose from "mongoose";

const userCommunityAccessSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    default: "Kerala",
  },
  district: {
    type: String,
    required: true,
  },
  taluk: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  panchayath: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const communityMembershipSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    role: { type: String, enum: ["owner", "admin", "moderator", "member"], default: "member" },
  },
  { timestamps: true }
);

export const CommunityMembership = mongoose.model("CommunityMembership", communityMembershipSchema);
export const UserCommunityAccess = mongoose.model("UserCommunityAccess", userCommunityAccessSchema);
export const communityschema = mongoose.model('community',communitySchema);