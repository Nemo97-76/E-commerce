import { Router } from "express";
import * as pc from './products.controller.js'
import {asyncHandler} from '../../utils/errorHandling.js'
import {multerCloudFunction} from '../../servies/multerCloudinary.js'
import { allowedExtentions } from "../../utils/allawedExtentions.js";
import {validationCoreFunction} from '../../middlewares/validation.js'
import * as validators from "./product.validation.js";
import {isAuth} from '../../middlewares/Auth.js'
import { productAPIRoles } from "./product.endPoint.js";
const PRODUCTrouter=Router()

PRODUCTrouter.post('/',isAuth(productAPIRoles.ADD_PRODUCT),multerCloudFunction(allowedExtentions.image).array('image'), validationCoreFunction(validators.addproductSchema),asyncHandler(pc.addproduct))
PRODUCTrouter.put('/',isAuth(productAPIRoles.UPDATE_PRODUCT),multerCloudFunction(allowedExtentions.image).array('image'),validationCoreFunction(validators.updateproductSchema),asyncHandler(pc.updateProduct))
PRODUCTrouter.delete('/',isAuth(productAPIRoles.DELETE_PRODUCT),validationCoreFunction(validators.deleteProductSchema),asyncHandler(pc.deleteproduct))
PRODUCTrouter.get('/',asyncHandler(pc.getAllproduct))
PRODUCTrouter.get('/search',asyncHandler(pc.getproductswfilter))

export default PRODUCTrouter;