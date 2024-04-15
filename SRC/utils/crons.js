import { scheduleJob } from 'node-schedule'
import { coponModel } from '../../DB/models/Coupon.model.js'
import moment from 'moment-timezone'

export const changeCouponStatusCron = () => {
  scheduleJob('* * /24 * * *', async function () {
    const validCoupons = await coponModel.find({ couponStatus: 'Valid' })
    for (const coupon of validCoupons) {
      if (
        moment(coupon.toDate)
          .tz('Africa/Cairo')
          .isBefore(moment().tz('Africa/Cairo'))
      ) {
        coupon.couponStatus = 'Expired'
      }
      await coupon.save()
    }

    console.log(`crons is running `)
  })
}