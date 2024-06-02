import mongoose, { Document, Schema } from "mongoose";

const MessageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photo : {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seenBy: {
        type : [{type: Schema.Types.ObjectId, ref: 'User'}],
        default: []
    }
})

const Message =  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export interface IMessage extends Document{
    chat?: string;
    sender?: string;
    photo?: string;
    text?: string;
    createdAt?: Date;
    seenBy?: any[];
}

export default Message;