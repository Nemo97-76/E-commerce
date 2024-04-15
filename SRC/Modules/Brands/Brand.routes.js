import { Router } from "express";
import * as bc from './Brands.controller.js'
import {asyncHandler} from '../../utils/errorHandling.js'
import { multerCloudFunction } from "../../servies/multerCloudinary.js";
import { allowedExtentions } from "../../utils/allawedExtentions.js";
import {isAuth} from '../../middlewares/Auth.js'
import * as validators from './Brand.Validation.schema.js'
import { validationCoreFunction } from "../../middlewares/validation.js";
import { BrandAPIRoles } from "./Brand.endPoint.js";

const BRANDrouter = Router();
BRANDrouter.post('/',isAuth(BrandAPIRoles.ADD_BARND),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(validators.createBrandSchema),asyncHandler(bc.addBrand))
BRANDrouter.put('/',isAuth(BrandAPIRoles.UPDATE_BRAND),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(validators.updateBrandSchema),asyncHandler(bc.updateBrand))
BRANDrouter.delete('/',isAuth(BrandAPIRoles.DELETE_BRAND),validationCoreFunction(validators.deleteBrandSchema),asyncHandler(bc.deleteBrand))
export default BRANDrouter