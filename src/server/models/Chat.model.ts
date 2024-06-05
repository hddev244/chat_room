import mongoose,{Document, Schema} from "mongoose";
import { IUser } from "./User.model";

const ChatSchema = new Schema({
    members: {
        type: [{type: Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    messages: {
        type: [{type: Schema.Types.ObjectId, ref: 'Message'}],
        default: [],
    },
    name: {
        type: String,
        default: '',
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupImage: {
        type: String,
        default: '',
    },
    creataAt : {
        type: Date,
        default: Date.now,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export interface IChat extends Document{
    members: IUser[] ;
    messages?: any[];
    name?: string;
    isGroup: boolean;
    groupImage?: string;
    creataAt?: Date;
    lastMessageAt?: string;
}

export default Chat;
