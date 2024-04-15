import { Router } from "express";
import * as cc from './coupon.controller.js'
import {asyncHandler} from '../../utils/errorHandling.js'
import {validationCoreFunction} from '../../middlewares/validation.js'
import * as validators from "./coupon.validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { couponAPIRoles } from "./coupon.endPOint.js";

const CUOPONrouter=Router()
CUOPONrouter.post('/',isAuth(couponAPIRoles.ADD_COUPON),validationCoreFunction(validators.addCouponSchema),asyncHandler(cc.AddCoupon))
CUOPONrouter.put('/',isAuth(couponAPIRoles.UPDATE_COUPON),validationCoreFunction(validators.updateCouponSchema),asyncHandler(cc.updateCoupon))
CUOPONrouter.delete('/:couponCode',isAuth(couponAPIRoles.DELETE_COUPON),validationCoreFunction(validators.deleteCouponSchema),asyncHandler(cc.deleteCoupon))


export default CUOPONrouter