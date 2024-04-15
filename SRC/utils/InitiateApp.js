import { ConnectionDB } from '../../DB/connection.DB.js'
import * as ROUTERS from '../Modules/index.routes.js'
import { changeCouponStatusCron } from './crons.js'
import { globalResponse } from './errorHandling.js'

export const initiateApp = (app, express) => {
    const port = +process.env.port
    app.use(express.json())
    ConnectionDB()
    /*routes*/
    app.use('/Category', ROUTERS.CATErouter)
    app.use('/Subcategory', ROUTERS.SUBCATErouter)
    app.use('/Brand', ROUTERS.BRANDrouter)
    app.use('/Product', ROUTERS.PRODUCTrouter)
    app.use('/Coupon', ROUTERS.CUOPONrouter)
    app.use('/auth', ROUTERS.AutherRouter)
    app.use('/Cart', ROUTERS.CARTrouter)
    app.use('/Order',ROUTERS.ORDERrouter)
    app.use('/Review',ROUTERS.REVIEWrouter)
    
    

    app.all('*', (req, res, next) => {
        res.status(404).json({ message: '404 page NOT found' })
    })
    app.use(globalResponse)
    changeCouponStatusCron()
    app.listen(port, () => console.log(`E-commerce project is running on port ${port}`))
}
