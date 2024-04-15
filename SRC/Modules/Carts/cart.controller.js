import { cartModel } from '../../../DB/models/cart.model.js'
import { productModel } from '../../../DB/models/product.model.js'

export const addToCart = async (req, res, next) => {
    const { _id } = req.authUser
    var { productId, quantity } = req.body
    const productCheck = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity }
    })
    if (!productCheck) {
        return next(new Error('invalid product,check quantity', { cause: 400 }))
    }
    const userCart = await cartModel.findOne({ userId: _id })
    let subTotal = 0
    /*if newCart*/
    if (!userCart) {
        subTotal = productCheck.priceAfter * quantity
        const Object = {
            userId: _id,
            products: [{ productId, quantity }],
            subTotal
        }
        const newCart = cartModel.create(Object)
        return res.status(200).json({
            message: 'Cart created and product added',
            newCart
        })
    }
    /*if cart is already exsit*/
    for (const product of userCart.products) {
        if (product.productId == productId) {
            product.quantity += quantity
            userCart.subTotal=quantity*productCheck.priceAfter
            await userCart.save()
        } else {
            userCart.products.push({ productId, quantity: quantity - 1 })
            userCart.subTotal=userCart.subTotal+productCheck.priceAfter*quantity
            await userCart.save()
        }
        await userCart.save()
    }
    if (!userCart.products.length) {
        userCart.products.push({ productId, quantity })
    }

    await userCart.save()
    res.status(200).json({
        message: "product added to your cart",
        userCart
    })
}

/*delete from cart*/
export const deleteFromCart = async (req, res, next) => {
    const { _id } = req.authUser
    const { productId } = req.body
    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new Error('invalid product id', { cause: 400 }))
    }
    const userCart = await cartModel.findOne({ userId: _id, 'products.productId': productId })
    if (!userCart) {
        return next(new Error('no such product in cart', { cause: 400 }))
    }
    userCart.products.forEach((e) => {
        if (e.productId == productId) {
            userCart.products.splice(userCart.products.indexOf(e), 1)
        }
    })
    await userCart.save()
    res.status(200).json({
        message: 'deleted',
        userCart
    })
}
