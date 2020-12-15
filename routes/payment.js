const express = require('express');
const router = express.Router();
const { PaymentGateway } = require('cashfree-sdk');

router.post('/request', (req,res) => {
	const pg = new PaymentGateway({
		env: 'TEST',
		apiVersion: '1.0.0',
		appId: process.env.CASHFREE_APPID,
		secretKey: process.env.CASHFREE_SECRET_KEY,
	});

	pg.orders
	.createOrders({
		orderId: '115',
		orderAmount: '100',
		orderCurrency: 'INR',
		orderNote: 'Subscription',
		customerName: 'Test Name',
		customerPhone: '9111122222',
		customerEmail: 'johndoe@cashfree.com',
		sellerPhone: '9900887766',
		returnUrl: 'http://localhost:5000/response',
		notifyUrl: 'http://localhost:5000/notify',
		paymentModes: '',
		pc: '',
	})
	.then((data) => {
		const url = data.paymentLink;
		res.render('request', {url: url})
	})
	.catch((error) => console.error(error));
});

module.exports = router;