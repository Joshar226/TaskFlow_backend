import type { Request, Response } from "express"
import Note from "../models/Note"

export class NoteController {
    static createNote = async (req: Request, res: Response) => {
        const note = new Note(req.body)

        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)
        
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note Created')
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }

    static deleteNote = async (req: Request, res: Response) => {
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        if(!note) {
            const error = new Error('Note not found')
            res.status(404).json({error: error.message})
            return
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Invalid Action')
            res.status(401).json({error: error.message})
            return
        }

        req.task.notes = req.task.notes.filter( note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([ note.deleteOne(), req.task.save()])
            res.send('Note Deleted')
        } catch (error) {
            res.status(500).json({error: 'Error'})
        }
    }
}