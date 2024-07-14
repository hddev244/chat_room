import mongoose, { Document,Schema } from 'mongoose';

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
    },
    chats : {
        type : [{type : Schema.Types.ObjectId, ref : 'Chat'}],
        default : [],
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    profileImage: string;
    chats: any[];
}

export default User;