const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors({ origin: true }));

class ApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async sendRequest(endpoint, method = 'POST', requestData = null) {
    let baseUrl;

    if (endpoint === 'hosted') {
      baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
    } else if (endpoint === 'bnpl') {
      baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/bnpl';
    } else {
      throw new Error('Invalid endpoint type');
    }
    const url = `${baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey
      },
    };
    if (requestData) {
      options.body = JSON.stringify(requestData);
    }
    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Details: ${JSON.stringify(responseData)}`);
        }
        return responseData;
      } else {
        const responseText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response not JSON: ${responseText}`);
      }
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

app.post('/payment', async (req, res) => {
  try {
    const requestData = req.body;
    const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
    const apiClient = new ApiClient(apiKey);

    let responseData;
    switch (requestData.method) {
      case 'klarna':
        responseData = await initiateKlarnaPayment(apiClient, requestData.items);
        break;
      case 'clearpay':
        responseData = await initiateClearpayPayment(apiClient, requestData.items);
        break;
      // Add cases for other payment methods here
      default:
        throw new Error('Invalid payment method');
    }
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
});

exports.payment = functions.https.onRequest(app);

