import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import isAuth from '../middlewares/isAuth.js';

const PaymentRouter = express.Router();

PaymentRouter.post("/order", isAuth, createOrder);
PaymentRouter.post("/verify", isAuth, verifyPayment)

export default PaymentRouter;