import { Router } from "express";
const REVIEWrouter=Router()
import * as rc from './review.controller.js'
import {asyncHandler} from '../../utils/errorHandling.js'
import * as validators from './review.validation.js' 
import {validationCoreFunction} from '../../middlewares/validation.js' 
import {isAuth} from '../../middlewares/Auth.js'
import { reviewAPIRpoles } from "./review.endPoint.js";

REVIEWrouter.post('/',isAuth(reviewAPIRpoles.ADD_REVIEW),validationCoreFunction(validators.addReviewSchema)),asyncHandler(rc.addreview)
REVIEWrouter.put('/',isAuth(reviewAPIRpoles.UPDATE_REVIEW),validationCoreFunction(validators.updateReviewSchema)),asyncHandler(rc.updateReview)
REVIEWrouter.delete('/',isAuth(reviewAPIRpoles.DELETE_RVIEW),validationCoreFunction(validators.deleteReviewSchema)),asyncHandler(rc.deleteReview)


export default REVIEWrouter