import mongoose from 'mongoose';
import User from '../models/User.model';
import Message from '../models/Message.model';
import Chat from '../models/Chat.model';
import fs from 'fs';
import path from 'path';

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

        registerModels();

        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

const registerModels = () => {
    User.init();
    Chat.init();
    Message.init();
}