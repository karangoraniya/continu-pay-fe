import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;

    console.log("connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

export default dbConnect;
