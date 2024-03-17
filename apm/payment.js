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

const apiKey = 'f742b7dcA75c6A406eAb1cbAf01be0047514';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
  const paymentMethodDetails = document.getElementById('payment-method-details');

  const initiatePayment = (basket) => {
  if (!paymentInitiated) {
      const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
      const paymentData = {
        organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
        currency: 'GBP',
        amount: totalAmount, // Use the calculated total amount
        capture_now: true,
        dynamic_descriptor: 'Demo Merchant Test Purchase',
        merchant_reference: 'ref_' + Date.now(), // Dynamically generate a reference
        return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
        webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
        transaction_type: 'first',
        duplicate_check: false,
        locale: 'en_GB',
        card: {
          create_token: true
        },
        billing_address: {
          first_name: 'John', // Placeholder for real customer data
          last_name: 'Doe', // Placeholder for real customer data
          email: 'john.doe@example.com', // Placeholder for real customer data
          address: '123 Main Street', // Placeholder for real customer data
          city: 'London', // Placeholder for real customer data
          state: 'London', // Placeholder for real customer data
          postal_code: 'SW1A 1AA', // Placeholder for real customer data
          country: 'GB', // Placeholder for real customer data
          phone: '441234567890' // Placeholder for real customer data
        },
        three_ds: {
          three_ds_required: true,
          three_ds_version: '2.0'
        }
      };
   apiClient.sendRequest('', 'POST', paymentData)
        .then(responseData => {
          if (responseData && responseData.url) {
            // Load the payment URL into the iframe and display it
            const paymentIframe = document.getElementById('payment-iframe');
            if (paymentIframe) {
              paymentIframe.src = responseData.url;
              paymentIframe.style.display = 'block';
            } else {
              console.error('Payment iframe not found');
            }
            paymentInitiated = true;
          } else {
            alert('Failed to initiate payment');
          }
        })
        .catch(error => {
          console.error('Payment initiation failed:', error);
          alert('Error initiating payment. Please try again.');
        });
    } else {
      console.log('Payment has already been initiated.');
    }
  };

    try {
      const response = await apiClient.sendRequest('', 'POST', paymentData);
      return response.url; // Assuming that the API response contains a URL property.
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Error initiating payment. Please try again.');
      return null;
    }
  };

  const updatePaymentDisplay = async () => {
    const selectedOption = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (selectedOption === 'card') {
      const paymentUrl = await initiatePayment();
      if (paymentUrl) {
        paymentMethodDetails.innerHTML = `<iframe src="${paymentUrl}" style="width:100%; height:600px; border:none;"></iframe>`;
      }
    } else if (selectedOption === 'alternative') {
      paymentMethodDetails.innerHTML = '<div>Alternative payment methods will be displayed here.</div>';
      // Implement your logic to display alternative payment methods.
    }
  };

  document.getElementById('payment-options-form').addEventListener('change', updatePaymentDisplay);

  // Call the function to set the default payment option on load
  updatePaymentDisplay();
});