import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import Task, { TaskType } from "./Task";
import { UserType } from "./User";
import Note from "./Note";


export type ProjectType = Document & {
    title: string
    description: string
    tasks: PopulatedDoc<TaskType & Document>[]
    manager: PopulatedDoc<UserType & Document>
    team: PopulatedDoc<UserType & Document>[]
}

const projectSchema : Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

//Middleware
projectSchema.pre('deleteOne', {document: true}, async function () {
    const projectId = this.id
    if(!projectId) return

    const tasks = await Task.find({project: projectId})

    tasks.forEach(async task => {
        await Note.deleteMany({task: task.id})
    })
    await Task.deleteMany({project: projectId})
})

const Project = mongoose.model<ProjectType>('Project', projectSchema)
export default Project