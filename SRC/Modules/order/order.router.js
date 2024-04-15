import { Router } from "express";
const ORDERrouter=Router()
import * as oc from './order.controller.js'
import {isAuth} from '../../middlewares/Auth.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import * as validators from './order.validation.js'
import {orderAPIroles} from './order.endPoints.js'
import { asyncHandler } from "../../utils/errorHandling.js";

ORDERrouter.post('/',isAuth(orderAPIroles.CREATE_ORDER),validationCoreFunction(validators.createOrderSchema),
asyncHandler(oc.createOrder))

ORDERrouter.post('/cartToOrder',isAuth(orderAPIroles.FROM_CART_TO_ORDER),asyncHandler(oc.fromCartToOrde))

ORDERrouter.get('/successOrder/:token',asyncHandler(oc.successPayment))
ORDERrouter.patch('/cancelOrder/:token',asyncHandler(oc.cancelPayment))

ORDERrouter.post('/delivered',isAuth(orderAPIroles.DELIVERE_ORDER),asyncHandler(oc.deliverOrder))

export default ORDERrouter