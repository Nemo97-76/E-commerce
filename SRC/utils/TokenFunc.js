import jwt from 'jsonwebtoken'
/*generation*/
export const generation=({
    payload={},
    signature=process.env.DEFAULT_SIGNATURE,
    expiresIn= '12h',
})=>{
    if (!Object.keys(payload).length) {
        return false
    }
    const token=jwt.sign(payload,signature,{expiresIn})
    return token
}
/*verification*/
export const verifyToken=({
    token='',
    signature=process.env.DEFAULT_SIGNATURE
})=>{
    if(!token){
        return false
    }
    const data=jwt.verify(token,signature)
    return data
}


