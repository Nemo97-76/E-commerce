import { Router } from "express";
import { multerCloudFunction } from "../../servies/multerCloudinary.js"; 
import { allowedExtentions } from '../../utils/allawedExtentions.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as cc from './categories.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import * as validators from './catogries.validation.js'
import subCategoryRouter from '../subCategories/Subcategories.routes.js'
import { isAuth } from '../../middlewares/Auth.js'
import {categoriesAPIRoles} from './categories.endpoint.js'

 const CATErouter=Router()
 CATErouter.use('/:categoryId',subCategoryRouter)

 CATErouter.post('/',isAuth(categoriesAPIRoles.CREATE_CATE),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(validators.createCategorySchema),asyncHandler(cc.CreateCategory))
 CATErouter.put('/',isAuth(categoriesAPIRoles.UPDATE_CATE),multerCloudFunction(allowedExtentions.image).single('image'),validationCoreFunction(validators.updateCategorySchema),asyncHandler(cc.UpdateCat))
 CATErouter.delete('/',isAuth(categoriesAPIRoles.DELETE_CATE),asyncHandler(cc.deleteCat))

 CATErouter.get('/',asyncHandler(cc.getAllcatwsub))


 export default CATErouter