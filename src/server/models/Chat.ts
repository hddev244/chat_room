import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    members: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        default: [],
    },
    messages: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
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

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

export interface IChat {
    _id?: string;
    members?: any[];
    messages?: any[];
    name?: string;
    isGroup: boolean;
    groupImage?: string;
    creataAt?: Date;
    lastMessageAt?: string;
}

export default Chat;