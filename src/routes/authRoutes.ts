import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Your name cannot be empty'),
    body('password')
        .isLength({min: 8}).withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords do not match')
            } 
            return true
        }),
    body('email')
        .isEmail().withMessage('Invalid E-mail')
        .notEmpty().withMessage('Your email cannot be empty'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('The token cannot be empty'), 
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid E-mail')
        .notEmpty().withMessage('Your email cannot be empty'),
    body('password')
        .notEmpty().withMessage('Your password cannot be empty'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code', 
    body('email')
        .isEmail().withMessage('Invalid E-mail'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('Invalid E-mail'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('The token has to be entered'),
    handleInputErrors,
    AuthController.validToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Invalid Token'),
    body('password')
        .isLength({min: 8}).withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
        }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('Your password is required'),
    handleInputErrors,
    AuthController.checkPassword 
)



export default router