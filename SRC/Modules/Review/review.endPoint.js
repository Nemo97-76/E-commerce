import {systemRoles} from '../../utils/systemRoles.js'
export const reviewAPIRpoles={
    ADD_REVIEW :[systemRoles.USER],
    DELETE_RVIEW:[systemRoles.ADMIN,systemRoles.USER],
    UPDATE_REVIEW:[systemRoles.USER]
}