import dotenv from 'dotenv'
import { transporter } from "../config/nodemailer"
dotenv.config()

type EmailType = {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        await transporter.sendMail({
            from: 'TaskFlow <josharaya226@gmail.com>',
            to: user.email,
            subject: 'TaskFlow - Confirma tu cuenta',
            text: 'TaskFlow - Confirma tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en TaskFlow</p>
                <h3>Confirma tu cuenta: 
                    <a href='${process.env.FRONTEND_URL}/auth/confirm-account'>Confirmar Cuenta</a>
                </h3>
                <p>E ingresa el código <b>${user.token}</b>  </p>
                <p>Este token expita en 10 minutos</p>
            `
        })
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        await transporter.sendMail({
            from: 'TaskFlow <admin@taskflow.com>',
            to: user.email,
            subject: 'TaskFlow - Restablece tu Password',
            text: 'TaskFlow - Restablece tu Password',
            html: `<p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                <h3>Visita el siguiente enlace: 
                    <a href='${process.env.FRONTEND_URL}/auth/new-password'>Reestablecer Password</a>
                </h3>
                <p>E ingresa el código <b>${user.token}</b>  </p>
                <p>Este token expita en 10 minutos</p>
            `
        })
    }

}