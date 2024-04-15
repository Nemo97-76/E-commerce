import { nanoid } from "nanoid"
import { cartModel } from '../../../DB/models/cart.model.js'
import { coponModel } from '../../../DB/models/Coupon.model.js'
import { orderModel } from '../../../DB/Models/order.model.js'
import { productModel } from "../../../DB/models/product.model.js"
import { qrCodeFunction } from '../../utils/qrCodeFunction.js'
import { generation, verifyToken } from '../../utils/TokenFunc.js'
import { couponValidationFunction } from '../../utils/couponValidation.js'
import Stripe from "stripe"
import { SendEmailServies } from "../../servies/sendEmailServies.js"
import createInvoice from '../../utils/pdfkit.js'
import { paymentFunction } from "../../utils/payment.js"
import { exmailTample } from "../../utils/emailTamplate.js"
import path from 'path'
/*create order*/
export const createOrder = async (req, res, next) => {
    const userId = req.authUser._id
    const { address, phoneNumbers, productId, quantity, paymentMethod, couponCode } = req.body
    if (couponCode) {
        const Coupon = await coponModel.findOne({ couponCode }).select('isFixedAmount isPercentage couponAmount couponAssginedToUsers')
        const IsCouponValid = await couponValidationFunction({
            couponCode,
            userId,
            next
        })
        console.log(IsCouponValid);
        console.log(IsCouponValid !== true);
        if (!IsCouponValid) {
            return next(new Error('coupon you have entered is invalid', { cause: 400 }))
        }
        req.couponCode = Coupon
    }
    const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!product) {
        return next(new Error('invalid product id', { cause: 400 }))
    }
    const products = []
    products.push({
        productId,
        quantity,
        title: product.title,
        price: product.priceAfter,
        finalPrice: product.priceAfter * quantity
    })
    const subTotal = product.priceAfter * quantity
    if (req.couponCode?.isFixedAmount && req.couponCode?.couponAmount > product.priceAfter) {
        return next(new Error('select another product', { cause: 400 }))
    }
    let paidAmount
    if (req.couponCode?.isPercentage) {
        paidAmount = subTotal * (1 - (req.couponCode?.couponAmount) || 0 / 100)
    } else if (req.couponCode?.isFixedAmount) {
        paidAmount = subTotal - req.couponCode.couponAmount
    } else {
        paidAmount = subTotal
    }
    let orderStatus
    paymentMethod == 'cash' ? (orderStatus = "placed") : (orderStatus = 'pending')
    const orderObject = {
        userId,
        products,
        subTotal,
        paidAmount,
        couponId: req.couponCode?._id,
        address,
        phoneNumbers,
        paymentMethod,
        orderStatus,
    }
    const orderDB = await orderModel.create(orderObject)
    if (!orderDB) {
        return next(new Error('fail to make order'))
    }
    let orderSession
    if (orderDB.paymentMethod == 'card') {
        if (req.couponCode) {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
            let coupon
            if (req.couponCode.isPercentage) {
                coupon = await stripe.coupons.create({
                    percent_off: req.couponCode.couponAmount
                })
            }
            if (req.couponCode.isFixedAmount) {
                coupon = await stripe.Coupon.create({
                    amount_off: req.couponCode.couponAmount * 100,
                    currency: 'EGP',
                })
            }
            req.couponCodeId = coupon.id
        }
        orderSession = await paymentFunction({
            payment_Method_types: [orderDB.paymentMethod],
            mode: 'payment',
            coustomer_email: req.authUser.email,
            metadata: { orderId: orderDB._id.toString() },
            sucess_url: `${req.protocol}://${req.headers.host}/Order/successOrder?token=${tokenOrder}`,
            cancel_url: `${req.protocol}://${req.headers.host}/Order/cancelOrder?token=${tokenOrder}`,
            line_items: orderDB.products.map((e) => {
                return {
                    price_data: {
                        product_data: {
                            name: e.title
                        },
                        unit_amount: e.price * 100
                    },
                    quantity: e.quantity
                }
            }),
            discounts: req.couponCodeId ? [{ coupon: req.couponCodeId }] : []
        })
    }
    const tokenOrder = generation({
        payload: { orderId: orderDB._id },
        signature: process.env.ORDER_TOKEN,
        expiresIn: '3h'
    })
    const orderQr = await qrCodeFunction({
        data: { orderId: orderDB._id, products: orderDB.products }
    })
    await productModel.findOneAndUpdate({ _id: productId }, { $inc: { stock: -parseInt(quantity) } }, { new: true })

    //await req.couponCode.save()
    res.status(201).json({
        message: "Order Done",
        orderDB,
        orderQr,
        tokenOrder
    })
}


/*cart to order*/
export const fromCartToOrde = async (req, res, next) => {
    const { cartId } = req.query
    const userId = req.authUser._id
    const { paymentMethod, address, phoneNumbers, couponCode } = req.body
    const cart = await cartModel.findOne({ _id: cartId })
    if (!cart || !cart.products.length) {
        return next(new Error('please add products to cart first', { cause: 400 }))
    }
    if (couponCode) {
        const coupon = await coponModel.findOne({
            couponCode
        }).select('isFixedAmount isPercentage couponAmount couponAssginedToUsers')
        const isCouponValid = await couponValidationFunction({
            couponCode, userId, next
        })
        if (!isCouponValid == true) {
            return isCouponValid
        }
        req.couponCode = coupon
    }
    let products = []
    for (const product of cart.products) {
        const productExsit = await productModel.findOne({ _id: product.productId })
        products.push({ productId: product.productId, quantity: product.quantity, title: productExsit.title, price: productExsit.priceAfter, finalprice: productExsit.priceAfter * product.quantity })
    }
    const subTotal = cart.subTotal
    let paidAmount
    if (req.couponCode?.isPercentage) {
        paidAmount = subTotal - req.couponCode.couponAmount
    } else {
        paidAmount = subTotal
    }
    let orderStatus
    paymentMethod == 'cash' ? (orderStatus = 'placed') : (orderStatus = 'pending')
    const orderObject = {
        userId,
        products,
        subTotal,
        paidAmount,
        couponId: req.couponCode?._id,
        address,
        phoneNumbers,
        paymentMethod,
        orderStatus,
    }
    const orderDB = await orderModel.create(orderObject)
    if (!orderDB) {
        return next(new Error('fail to order'))
    }
    const tokenOrder = generation({
        payload: { orderId: orderDB._id },
        signature: process.env.ORDER_TOKEN_SIGNATURE,
        expiresIn: "3h"
    })
    let orderSession
    if (orderDB.paymentMethod == 'card') {
        orderSession = await paymentFunction({
        payment_Method_types: ['card'],
        mode: 'payment',
        customer_email: req.authUser.email,
        metadata: { orderId: orderDB._id.toString() },
        success_url: `${req.protocol}://${req.headers.host}/Order/successOrder?token=${tokenOrder}`,
        cancel_url: `${req.protocol}://${req.headers.host}/Order/cancelOrder?token=${tokenOrder}`,
        line_items: orderDB.products.map((e) => {
            return {
                price_data: {
                    currency: 'EGP',
                    product_data: {
                        name: e.title
                    },
                    unit_amount: e.price * 100
                },
                quantity: e.quantity
            }
        }),
        discounts: req.couponCodeId ? [{ coupon: req.couponCodeId }] : []
    })
        if (req.couponCode) {
            let coupon
            if (req.couponCode.isPercentage) {
                coupon=await paymentFunction({
                    percent_off:req.couponCode.couponAmount
                })
            }
            if (req.couponCode.isFixedAmount) {
                coupon=await paymentFunction({
                    amount_off:req.couponCode.couponAmount * 100,
                    currency:'EGP'
                })
            }
            req.couponCodeId = coupon.id
        }
    }
    

    const orderCode = `${req.authUser.userName}_${nanoid(3)}`
    const orderinvoice = {
        orderCode,
        date: orderDB.createdAt,
        shipping: {
            name: req.authUser.userName,
            address: orderDB.address,
            city: 'Cairo',
            country: 'Egypt',
        },
        items: orderDB.products,
        subTotal: orderDB.subTotal,
        paidAmount: orderDB.paidAmount
    }
    createInvoice(orderinvoice, `${orderCode}.pdf`)
    const isEmailSent = await SendEmailServies({
        to: req.authUser.email,
        subject: 'Order Confirmation',
        message: exmailTample({
            linkData:'open order invoice below',
            subject:'order Confirmation'
        }),
       attachments:[{path:`./Files/${orderCode}.pdf`}]
    })
    if (!isEmailSent) {
        return next(new Error('email fail'))
    }
    for (const product of cart.products) {
        await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }
    if (req.couponCode) {
        for (const user of req.couponCode?.couponAssginedToUsers) {
            if (user.userId.toString() == userId.toString()) {
                user.usageCount += 1
            }
        }
        await req.couponCode.save()
    }
    cart.products = []
    cart.subTotal=0
    await cart.save()
    res.status(201).json({
        message: "done",
        orderDB,
        cart,
        tokenOrder
    })
}
/*success payment*/
export const successPayment = async (req, res, next) => {
    const { token } = req.params
    const decodeData = verifyToken({
        token, signature: process.env.ORDER_TOKEN_SIGNATURE
    })
    const order = await orderModel.findOne({
        _id: decodeData.orderId, orderStatus: 'pending'
    })
    if (!order) {
        return next(new Error('invalid order Id', { cause: 400 }))
    }
    order.orderStatus = "confirmed"
    await order.save()
    res.status(200).json({
        message: "Done",
        order
    })
}

/*cancel payment or cancel order*/
export const cancelPayment = async (req, res, next) => {
    const {token}=req.params
    const decodeData=verifyToken({
        token,signature:process.envORDER_TOKEN 
    })
    const order=await orderModel.findOne({_id:decodeData.orderId})
    if(!order){
        return next(new Error('invalid order Id', { cause: 400 }))
    }
    order.orderStatus='canceled'
    await order.save()
    await orderModel.findOneAndDelete({_id:decodeData.orderId})
    for (const product of order.products) {
        await productModel.findOneAndUpdate({_id:product.productId},{$inc:{stock:parseInt(product.quantity)}})
    }
    if(order.couponId){
        const coupon=await coponModel.findById(order.couponId)
        if(!coupon){
        return next(new Error('invalid coupon Id', { cause: 400 }))
        }
        coupon.couponAssginedToUsers.map((e)=>{
            if(order.userId.toString()==e.userId.toString()){
                e.usageCount-=1
            }
        })
        await coupon.save()
    }
    res.status(200).json({
        message:"done",
        order
    })

}
/*delivered order*/
export const deliverOrder = async (req, res, next) => {
    const {orderId}=req.query
    const order=await orderModel.findOneAndUpdate({
        _id:orderId,orderStatus:{$nin:['delivered', 'pending', 'canceled', 'rejected']}
    },{orderStatus:'delivered'},{new:true})
    if(!order){   
             return next(new Error('invalid order Id', { cause: 400 }))
}
 res.status(200).json({
    message:"done",
    order
 })
 }