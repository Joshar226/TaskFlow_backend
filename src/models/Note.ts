import mongoose, { Document, Schema, Types } from "mongoose";

export type NoteType = Document & {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

export const noteSchema : Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true})

const Note = mongoose.model<NoteType>('Note', noteSchema)
export default Note