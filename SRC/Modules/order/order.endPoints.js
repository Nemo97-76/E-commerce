import { systemRoles } from '../../utils/systemRoles.js'

export const orderAPIroles={
    CREATE_ORDER:[systemRoles.USER],
    FROM_CART_TO_ORDER:[systemRoles.USER],
    DELIVERE_ORDER: [systemRoles.ADMIN],
}