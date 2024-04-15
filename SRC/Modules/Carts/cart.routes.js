import { Router } from "express"
import * as cc from './cart.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js"
import {validationCoreFunction} from '../../middlewares/validation.js'
import * as validators from './cart.validation.js'
import { cartAPIRoles } from "./cart.endPoint.js"
import { isAuth } from "../../middlewares/Auth.js"

const CARTrouter=Router()

CARTrouter.post('/',isAuth(cartAPIRoles.ADD_TO_CART),validationCoreFunction(validators.addToCartSchema),asyncHandler(cc.addToCart))
CARTrouter.delete('/',isAuth(cartAPIRoles.DELETE_FROM_CART),asyncHandler(cc.deleteFromCart))


export  default CARTrouter