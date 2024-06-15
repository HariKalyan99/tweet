import mongoose from 'mongoose';

const connectToMongo = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`)
    }catch(error){
        console.error(`Error connecting to mongoDB: ${error.message}`);
        process.exit(1)
    }
}

export default connectToMongo;