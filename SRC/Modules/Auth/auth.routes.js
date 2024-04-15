import {  Router } from "express";
const AutherRouter=Router()
import * as ac from './auth.controller.js'
import {asyncHandler} from '../../utils/errorHandling.js'
import * as validators from './auth.validation.js'
import {validationCoreFunction} from '../../middlewares/validation.js'
import { multerCloudFunction } from "../../servies/multerCloudinary.js";
import { allowedExtentions } from "../../utils/allawedExtentions.js";

AutherRouter.post('/',validationCoreFunction(validators.signUpSchema),multerCloudFunction(allowedExtentions.image).single("image"),asyncHandler(ac.signUp))
AutherRouter.get('/confirm/:token',asyncHandler(ac.ConfirmEmail))
AutherRouter.post('/SignIn',validationCoreFunction(validators.signInSchema),asyncHandler(ac.signIn))
AutherRouter.post('/fortgetPass',asyncHandler(ac.forgetPass))
AutherRouter.post('/rest/:token',validationCoreFunction(validators.forgetPassSchema),asyncHandler(ac.restpass))
export default  AutherRouter;