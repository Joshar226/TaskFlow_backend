import mongoose, { Document, model, Schema, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
}

export type taskStatus = typeof taskStatus [keyof typeof taskStatus]

export type TaskType = Document & {
    title: string
    description: string
    project: Types.ObjectId
    status: taskStatus
    completedBy: {
        user: Types.ObjectId
        status: taskStatus
    }[],
    notes: Types.ObjectId[]
}

export const taskSchema : Schema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true})

//Middleware
taskSchema.pre('deleteOne', {document: true}, async function () {
    const taskId = this.id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
})

export const Task = mongoose.model<TaskType>('Task', taskSchema)
export default Task