const express = require('express');
const router = express.Router();
const { PaymentGateway } = require('cashfree-sdk');

let pg = new PaymentGateway({
	env: 'TEST',
	apiVersion: '1.0.0',
	appId: process.env.CASHFREE_APPID,
	secretKey: process.env.CASHFREE_SECRET_KEY,
});

router.post('/request', (req,res) => {

	const orderId = '230';

	pg.orders
	.createOrders({
		orderId: orderId,
		orderAmount: '100',
		orderCurrency: 'INR',
		orderNote: 'Subscription',
		customerName: 'Test Name',
		customerPhone: '9111122222',
		customerEmail: 'johndoe@cashfree.com',
		sellerPhone: '9900887766',
		returnUrl: 'http://localhost:5000/payments/response/'+orderId,
		notifyUrl: 'http://localhost:5000/notify',
		paymentModes: '',
		pc: '',
	})
	.then((data) => {
		if(data.status == "ERROR") return res.status(400).render('error',{msg: data.reason});
		const url = data.paymentLink;
		res.render('request', {url: url})
	})
	.catch((error) => console.error(error));
});

router.post('/response/:id', (req,res) => {

	const orderid = req.params.id;
	pg.orders
	.getStatus({
		orderId: orderid,
	})
	.then((data) => {
		res.render('response', {status: data.txStatus, message: data.txMsg});
	})
	.catch((error) => console.error(error));
})

module.exports = router;