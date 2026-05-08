import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const {planId, amount, credits} = req.body;
            if(!amount || !credits) {
                return res.status(400).json({message: "Invalid Plan Data"});
            }

            const options = {
                amount: amount * 100, // convert to paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            }

            const order = await razorpay.orders.create(options);

                await Payment.create({
                    userId: req.userId,
                    planId,
                    amount,
                    credits,
                    razorpayOrderId: order.id,
                    status: "created",
                });

                return res.json(order)

    } catch (error) {
        return res.status(500).json({message: `Failed to create razorpay order ${error}`});
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {razorpayOrderId, razorpayPaymentId, razorpaySignature} = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

        if(expectedSignature !== razorpaySignature) {
            return res.status(400).json({message: "Invalid Payment Signature"})
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpayOrderId,
        });

        if (!payment) {
            return res.status(404).json({message: "Payment not found"})
        }

        if (payment.status === "paid") {
            return res.json({ message: "Already Processed" }); 
        }

        // Update Payment Record
        payment.status = "paid";
        payment.razorpayPaymentId = razorpayPaymentId;
        await payment.save();

        // Add Credits to user
        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
            $inc: { credits: payment.credits },
        }, { new: true })

        res.json({
            success: true,
            message: "Payment Verified and Credits Added",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({message: `Failed to verify razorpay payment ${error}`});
    }
}