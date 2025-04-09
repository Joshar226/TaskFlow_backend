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
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; color: #333;">
                    <p style="font-size: 16px;">Hello <strong>${user.name}</strong>, your account has been successfully created in <strong>TaskFlow</strong>.</p>

                    <h3 style="font-size: 18px; margin-top: 20px;">
                        Please confirm your account:
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account" 
                        style="display: inline-block; margin-top: 10px; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
                        Confirm Account
                        </a>
                    </h3>
                    
                    <p style="font-size: 16px; margin-top: 20px;">
                        Enter the following code: <strong>${user.token}</strong>
                    </p>

                    <p style="font-size: 14px; color: #777;">
                        This token will expire in 10 minutes.
                    </p>
                </div>
            `
        })
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        await transporter.sendMail({
            from: 'TaskFlow <josharaya226@gmail.com>',
            to: user.email,
            subject: 'TaskFlow - Restablece tu Password',
            text: 'TaskFlow - Restablece tu Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; color: #333;">
                    <p style="font-size: 16px;">Hello <strong>${user.name}</strong>, here is the link to reset your password with <strong>TaskFlow</strong>.</p>
                    
                    <h3 style="font-size: 18px; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}/auth/new-password" 
                        style="display: inline-block; margin-top: 10px; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
                        Reset Password
                        </a>
                    </h3>
                    
                    <p style="font-size: 16px; margin-top: 20px;">
                        Enter the following code: <strong>${user.token}</strong>
                    </p>

                    <p style="font-size: 14px; color: #777;">
                        This token will expire in 10 minutes.
                    </p>
                </div>
            `
        })
    }

}