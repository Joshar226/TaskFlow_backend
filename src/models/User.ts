import mongoose, { Document, Schema } from "mongoose";

export type UserType = Document & {
    email: string
    password: string
    name: string
    confirmed: boolean
}

export const userSchema : Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model<UserType>('User', userSchema)
export default User