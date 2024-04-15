import joi from "joi";
export const signUpSchema = {
    query: joi.object({ userName: joi.string().min(5).required(), email: joi.string().required(), password: joi.string().min(8).required(), age: joi.number().required(), gender: joi.string(), phone: joi.number().optional(), address: joi.string().required(), role: joi.string().required(),profilePic:joi.object().optional() }).required()
}
export const signInSchema={
    body:joi.object({email:joi.string().required(),password:joi.string().required()}).required()
}
export const forgetPassSchema={
    body:joi.object({
        email:joi.string().required()
    }).required()
}