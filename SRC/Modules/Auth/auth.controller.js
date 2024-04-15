import { nanoid } from 'nanoid'
import { userModel } from '../../../DB/Models/user.model.js'
import { SendEmailServies } from '../../servies/sendEmailServies.js'
import { exmailTample } from '../../utils/emailTamplate.js'
import { generation, verifyToken } from '../../utils/TokenFunc.js'
import pkg, { hashSync } from 'bcrypt'
import cloudinary from '../../utils/cloudinaryCofigration.js'

/*SignUp */
export const signUp = async (req, res, next) => {
    const { userName, email, password, age, gender, phone, address, role } = req.query
    const isUserExist = await userModel.findOne({ userName })
    if (isUserExist) {
        return next(new Error('user alredy exist,sign in instead', { cause: 400 }))
    }
    const hashedPass = hashSync(password, +process.env.SALT_ROUNDS)
    const token = generation({
        payload: {
            email,
            userName,
        },
        signature: process.env.CONFIRMATION_EMAIL_SIGNATURE,
        expiresIn: '12h'
    })
    const conirmationlink = `${req.protocol}://${req.headers.host}/auth/confirm/${token}`
    const ismailSent = SendEmailServies({
        to: email,
        subject: "Confirmation Email",
        message: exmailTample({
            link: conirmationlink,
            linkData: 'click here to confirm your Email ',
            subject: "Confirmation Email"
        })
    })

    if (password.length < 8) {
        return next(new Error('password must be at least 8 characters', { cause: 400 }))
    }
    if (!ismailSent) {
        return next(new Error('fail to sent confirmation email', { cause: 400 }))
    }
    const userFolder = nanoid(5) + `${userName}`
    if(req.file){
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.PROJECT_FOLDER}/usersProfirPics/${userFolder}` })
    const userObject = {
        userName,
        email,
        password: hashedPass,
        age,
        gender,
        phone,
        address,
        role,
        profilePic: { secure_url, public_id }
    }
const saveUser=await userModel.create(userObject)
        res.status(200).json({
            message: `${userName}'s account created successfully`, saveUser, token
        })
    }else{
        const userObject = {
            userName,
            email,
            password: hashedPass,
            age,
            gender,
            phone,
            address,
            role,
            profilePic:{secure_url:"",public_id:""}
        }
        const saveUser=await userModel.create(userObject)
        res.status(200).json({
            message: `${userName}'s account created successfully`, saveUser
        })
    }
        }



/*Confirm Email*/
export const ConfirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decode = verifyToken({
        token,
        signature: process.env.CONFIRMATION_EMAIL_SIGNATURE
    })
    const user = await userModel.findOneAndUpdate(
        { email: decode?.email, isConfirmed: false },
        { isConfirmed: true },
        { new: true }
    )
    if (!user) {
        return next(new Error('already confirmed', { cause: 400 }))
    }
    res.status(200).json({
        message: 'Confirmed,try to Signin'
    })
}
/*SignIn*/
export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }
    const isPassMatch = pkg.compareSync(password, user.password)
    if (!isPassMatch) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }
    const token = generation({
        payload: {
            email,
            _id: user._id
        },
        signature: process.env.SIGN_IN_SIGNATURE,
        expiresIn: "12h"
    })
    const USER = await userModel.findOneAndUpdate({ email }, {  status: "online" }, { new: true })
    res.status(200).json({
        message: "Signed in successfully",
        USER,
        token
    })
}
/*forget password*/
export const forgetPass = async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error('invalid Email', { cause: 400 }))
    }
    const code = nanoid()
    const hashedcode = pkg.hashSync(code, +process.env.SALT_ROUNDS)
    const token = generation({
        payload: {
            email,
            sentcode: hashedcode
        },
        signature: process.env.RESET_SIGNATURE,
        expiresIn: '12h'
    })
    const restPassLINK = `${req.protocol}://${req.headers.host}/auth/rest/${token}`
    const ismailSent = SendEmailServies({
        to: email,
        subject: 'rest password',
        message: exmailTample({
            link: restPassLINK,
            linkData: 'Click here to rest your password',
            subject: 'rest password email'
        })
    })
    if (!ismailSent) {
        return next(new Error('fail to send rest password email', { cause: 400 }))
    }
    const userupdate = await userModel.findOneAndUpdate({ email }, { forgetcode: hashedcode }, { new: true })
    res.status(200).json({
        message: "password has succesfully rest",
        userupdate
    })
}
/*rest password*/
export const restpass = async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token, signature: process.env.RESET_SIGNATURE })
    const user = await userModel.findOne({ email: decoded?.email, forgetcode: decoded?.sentcode })
    if (!user) {
        return next(new Error("you already rest your password once before, try to signin", { cause: 400 }))
    }
    const { newpass } = req.body
    user.password = newpass
    user.forgetcode = null
    const restedpassData = await user.save()
    res.status(200).json({
        message: 'password rested successfully',
        restedpassData
    })
}
