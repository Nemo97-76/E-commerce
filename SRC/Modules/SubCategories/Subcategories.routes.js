import { Router } from "express";
import { asyncHandler } from '../../utils/errorHandling.js'
import { multerCloudFunction } from '../../servies/multerCloudinary.js'
import { allowedExtentions } from "../../utils/allawedExtentions.js";
import { validationCoreFunction } from '../../middlewares/validation.js'
import {AddSubCatSchema,updateSubCateSchema,deleteSubCateSchema} from './SubCategories.validation.js'
import * as sc from './SubCategories.controller.js'
import {isAuth} from '../../middlewares/Auth.js'
import { SubCateAPIRoles } from "./SubCtegories.endPoint.js";
const SUBCATErouter = Router({mergeParams:true})

SUBCATErouter.post('/',isAuth(SubCateAPIRoles.ADD_SUBCATE),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(AddSubCatSchema),asyncHandler(sc.addSubCat))
SUBCATErouter.put('/',isAuth(SubCateAPIRoles.UPDATE_SUBCATE),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(updateSubCateSchema),asyncHandler(sc.updatesubCate))
SUBCATErouter.delete('/',isAuth(SubCateAPIRoles.DELETE_SUBCATE),asyncHandler(sc.deleteSubCat))


export default SUBCATErouter;


