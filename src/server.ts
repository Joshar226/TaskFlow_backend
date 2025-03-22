import express from 'express'
import dotenv from 'dotenv'
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import { connectDB } from './config/db'
import morgan from 'morgan'
import { corsConfig } from './config/cors'

dotenv.config()

connectDB()

const server = express()
server.use(cors(corsConfig))

server.use(morgan('dev'))
server.use(express.json())

server.use('/api/auth', authRoutes)
server.use('/api/projects', projectRoutes)

export default server
