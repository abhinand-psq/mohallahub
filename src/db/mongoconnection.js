import mongoose from 'mongoose';

async function connectdb() {
  try {
    await mongoose.connect(process.env.Mongodb);
    return `data base is currently connected`;
  } catch (e) {
    throw new Error(e);
  }
}

export default connectdb;
