import nodemailer from "nodemailer"

export const SendEmailServies=async({
    to,subject,message,attachments=[]
}={})=>{

    const transporter=nodemailer.createTransport({
        host:"localhost",
        port:587,
        secure:false, 
         service:'gmail',
         auth:{
            user:'tasneemyoussef61@gmail.com',
            pass:process.env.nodemailerPass
         }
    })
    const emailInfo= await transporter.sendMail({
        from:`Tasneem Youssef tasneemyoussef61@gmail.com`,
        to:to ?to: '',
        subject: subject?subject:'hello',
        html:message? message : '',
        attachments,
    })
    
if (emailInfo.accepted.length) {
    return true
}
return false
}
