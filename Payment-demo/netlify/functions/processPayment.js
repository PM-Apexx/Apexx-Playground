// netlify/functions/processPayment.js
const payment = require('../payment');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }
    
    try {
        const result = await payment.process(event.body); // Assuming your payment.js exports a function named 'process'
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Payment processing failed',
        };
    }
};

