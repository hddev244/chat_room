import mongoose,{Document, Schema} from "mongoose";

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

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

export interface IChat extends Document{
    members?: any[];
    messages?: any[];
    name?: string;
    isGroup: boolean;
    groupImage?: string;
    creataAt?: Date;
    lastMessageAt?: string;
}

export default Chat;