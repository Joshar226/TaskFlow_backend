import type { Request, Response } from "express"
import User from '../models/User'
import Project from "../models/Project"

export class TeamController {

    static findMember = async (req: Request, res: Response) => {
        const {email} = req.body

        try {
            const user = await User.findOne({email}).select('id name email')
            if(!user) {
                const error = new Error('User not found')
                res.status(404).json({error: error.message})
                return
            }
            res.json(user)
        } catch (error) {
            console.log(error);
            
        }
    }

    static addMember = async (req: Request, res: Response) => {
        const {id} = req.body

        try {
            const user = await User.findById(id)

            if(!user) {
                const error = new Error('User not found')
                res.status(404).json({error: error.message})
                return
            }

            if(req.project.team.some( team => team._id.toString() === user.id.toString())) {
                const error = new Error('The user already exists in the project')
                res.status(409).json({error: error.message})
                return
            }

            if(req.project.manager._id.toString() === user.id.toString()) {
                const error = new Error('The user is the manager')
                res.status(409).json({error: error.message})
                return
            }

            req.project.team.push(user.id)
            await req.project.save()
            res.json('Collaborator Added Successfully')
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectMembers = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.project.id).select('team').populate({
                path: 'team',
                select: 'id name email'
            })
            res.json(project.team)
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }

    static removeMember = async (req: Request, res: Response) => {
        try {
            const {userId} = req.params

            if(!req.project.team.some( team => team.toString() === userId.toString())) {
                const error = new Error('The user does not exist in the project')
                res.status(409).json({error: error.message})
                return
            }

            req.project.team = req.project.team.filter( member => member.toString() !== userId.toString())
            req.project.save()
            res.send('Collaborator Successfully Removed')
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }
}