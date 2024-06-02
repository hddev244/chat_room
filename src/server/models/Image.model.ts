import mongoose, { Document, Schema } from "mongoose";

const ImageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

const Image = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

export interface IImage extends Document{
    name: string;
    url: string;
    path: string;
    owner: string;
}

export default Image;