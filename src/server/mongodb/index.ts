import mongoose from 'mongoose';

let isConnected:boolean = false;

export const connectToDatabase = async () => {
    // mongoose.set('strictQuery', true);

    if(isConnected){
        console.log('MongoDB is already connected');
        return;
    }

    try {
        const url = process.env.MONGODB_URI as string;

        if(!url){
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(url);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}