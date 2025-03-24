import type {Request, Response} from 'express'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task Successfully Created')
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({path: 'completedBy.user', select: 'id name'})
                .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name'}})
            res.json(task)
        } catch (error) {
            console.log(error);
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const {status} = req.body

            req.task.status = status
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save()
            res.send('Status updated')
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }
}