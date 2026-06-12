import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

async function connect() {
  const res = await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    if(res) console.log("Connected to MongoDB successfully");
}

export default connect;