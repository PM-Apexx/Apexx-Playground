class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async sendRequest(endpoint, method = 'POST', requestData = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey,
      },
    };

    if (requestData) {
      options.body = JSON.stringify(requestData);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

const apiKey = '473be873A0912A4eedAb26cA2edf67bb4faa';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.paymentButton').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.getAttribute('data-product-name'); // Dynamic product name
      const amount = this.getAttribute('data-amount'); // Dynamic product price
      const productId = this.getAttribute('data-product-id'); // Product ID if needed
      initiatePayment(amount, productName, productId);
    });
  });
});

let paymentInitiated = false;

const initiatePayment = (amount, productName, productId) => {
  if (!paymentInitiated) {
    const paymentData = {
      organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
      currency: 'GBP',
      amount: amount,
      capture_now: true,
      dynamic_descriptor: 'Demo Merchant Test Purchase',
      merchant_reference: 'ghjhgjhghfgf',
      return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
      webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
      transaction_type: 'first',
      duplicate_check: false,
      locale: 'en_GB',
      card: {
        create_token: true
      },
      billing_address: {
        first_name: 'FIRSTNAME',
        last_name: 'LASTNAME',
        email: 'EMAIL@DOMAIN.COM',
        address: '12',
        city: 'CITY',
        state: 'STATE',
        postal_code: '34',
        country: 'GB',
        phone: 44123456789
      },
      three_ds: {
        three_ds_required: true,
        three_ds_version: '2.0'
      }
    };

    apiClient.sendRequest('', 'POST', paymentData)
      .then(responseData => {
        console.log('API Response Data:', responseData);
        if (responseData && responseData.url) {
          console.log('Redirecting to:', responseData.url);
          window.location.href = responseData.url;
          paymentInitiated = true;
        } else {
          console.error('No payment URL received in the response data.');
        }
      })
      .catch(error => {
        console.error('Error occurred while initiating payment:', error);
      });
  } else {
    console.log('Payment has already been initiated.');
  }
};
