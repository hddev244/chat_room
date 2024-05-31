import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: '',
        required: false
    },
    chats : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref : 'Chat'}],
        default : [],
        required : false
    }

}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export interface IUser {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    profileImage?: string;
    chats?: string[];
}

export default User;