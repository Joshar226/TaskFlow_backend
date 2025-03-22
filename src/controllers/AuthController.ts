import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const {password, email} = req.body

            const userExist = await User.findOne({email})
            if(userExist) {
                const error = new Error ('The user is already registered')
                res.status(409).json({error: error.message})
                return
            }

            const user = new User (req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created, check your email to confirm')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body

            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Invalid token')
                res.status(404).json({error: error.message})
                return
            }

            const userExist = await User.findById(tokenExist.user)            
            userExist.confirmed = true

            await Promise.allSettled([userExist.save(), tokenExist.deleteOne()])
            res.send('Account confirmed correctly')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body

            //Buscar User
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Email not found')
                res.status(404).json({error: error.message})
                return
            }

            //User no Confirmado
            if(!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('The account has not been confirmed, we have sent a confirmation email.')
                res.status(401).json({error: error.message})
                return
            }

            //Revisar Password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Incorrect Password')
                res.status(401).json({error: error.message})
                return
            }

            //Generar JWT
            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res: Response) => {
        try {
            const {email} = req.body

            //Buscar User
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Email not found')
                res.status(404).json({error: error.message})
                return
            }

            //Revisar si el User ya esta confirmado
            if(user.confirmed) {
                const error = new Error('User already confirmed')
                res.status(403).json({error: error.message})
                return
            }

            //Crear Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('A new token was sent')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static forgotPassword = async (req : Request, res: Response) => {
        try {
            const {email} = req.body

            //Buscar User
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Email not found')
                res.status(404).json({error: error.message})
                return
            }

            //Crear Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Check your email for instructions')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static validToken = async (req : Request, res: Response) => {
        const {token} = req.body

        const tokenExist = await Token.findOne({token})
        if(!tokenExist) {
            const error = new Error('Invalid Token')
            res.status(404).json({error: error.message})
            return
        }
        res.send('Token confirmed')
    }

    static updatePasswordWithToken = async (req : Request, res: Response) => {
        const {token} = req.params

        const tokenExist = await Token.findOne({token})

        if(!tokenExist) {
            const error = new Error('Invalid Token')
            res.status(404).json({error : error.message})
            return
        }

        const user = await User.findById(tokenExist.user)
        user.password = await hashPassword(req.body.password)

        await Promise.allSettled([tokenExist.deleteOne(), user.save()])
        res.send('Password updated correctly')
    }

    static user = async (req : Request, res: Response) => {
        res.json(req.user)
        return
    }

    static checkPassword = async (req : Request, res: Response) => {
        const {password} = req.body
        const user = await User.findById(req.user.id)
        
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Incorrect password')
            res.status(401).json({error: error.message})
            return
        }
        res.send('Correct Password')
    }
}