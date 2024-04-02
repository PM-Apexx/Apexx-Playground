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

function handlePaymentResponse() {
  // Display a payment successful message
  const paymentMessage = document.getElementById('payment-message');
  if (paymentMessage) {
    paymentMessage.textContent = 'Payment successful! Thank you for your order.';
  }

  // Get the productUrl query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productUrl = urlParams.get('productUrl') || 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html';

  // Redirect back to the products page
  const productsSection = document.querySelector('.products');
  if (productsSection) {
    productsSection.style.display = 'flex';
  } else {
    window.location.href = productUrl;
  }

  // Reset the basket and update the basket count
  basket = [];
  const updateBasketCount = () => {
  const cartButton = document.getElementById('cart');
  console.log('Cart button:', cartButton); // Add this line
  console.log('Basket:', basket); // Add this line
  cartButton.textContent = `Basket (${basket.length})`;
};

  // Reset any other necessary state or data
  // ...
}

window.onload = handlePaymentResponse;


const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);
let paymentInitiated = false;
let basket = [];

  const updateBasketCount = () => {
    const cartButton = document.getElementById('cart');
    cartButton.textContent = `Basket (${basket.length})`;
  };
const displayPaymentForm = () => {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.style.display = 'block';
  } else {
    console.error('Payment form not found');
  }
};
const initiatePayment = async (basket) => {
  if (!paymentInitiated) {
      const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
      const paymentData = {
        organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
        currency: 'GBP',
        amount: totalAmount, // Use the calculated total amount
        capture_now: true,
        dynamic_descriptor: 'Demo Merchant Test Purchase',
        merchant_reference: 'ref_' + Date.now(), // Dynamically generate a reference
        return_url: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html',
        webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
        transaction_type: 'first',
        duplicate_check: false,
        locale: 'en_GB',
        card: {
          create_token: false
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
  try {
      const responseData = await apiClient.sendRequest('', 'POST', paymentData);
      if (responseData && responseData.url) {
        const paymentIframe = document.getElementById('payment-iframe');
        if (paymentIframe) {
          paymentIframe.src = responseData.url;
          paymentIframe.style.display = 'block';
        } else {
          console.error('Payment iframe not found');
        }
        paymentInitiated = true;
      } else {
        showError('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      showError('Error initiating payment. Please try again.');
    }
  } else {
    console.log('Payment has already been initiated.');
  }
};
const initiateSofortPayment = async (basket) => {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT3455640', // Dynamically generate a reference
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    sofort: {
      account_holder_name: 'Test Name',
      redirection_parameters: {
        return_url: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?returnUrl=https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html'
      } 
    },
    customer: {
      first_name: 'AP',
      last_name: 'Test',
      email: 'test@test.com',
      phone: '01234567890',
      date_of_birth: '1994-08-11',
      address: {
        country: 'DE'
      }
    },
    delivery_customer: {
      first_name: 'Ppro',
      last_name: 'Test',
      address: {
        address: 'Add 1',
        city: 'City',
        state: 'CA',
        postal_code: '90002',
        country: 'DE'
      }
    }
  };
try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData);
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate SOFORT payment');
    }
  } catch (error) {
    console.error('SOFORT payment initiation failed:', error);
    showError('Error initiating SOFORT payment. Please try again.');
  }
};
const showError = (message) => {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else {
    alert(message);
  }
};
const initiateBancontactPayment = async (basket) => {
const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
const paymentData = {
organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bancontact: {
      account_holder_name: 'Test Name',
      redirection_parameters: {
        return_url: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html'
      } 
    },
    customer: {
      first_name: 'AP',
      last_name: 'Test',
      email: 'test@test.com',
      phone: '01234567890',
      date_of_birth: '1994-08-11',
      address: {
        country: 'BE'
      }
    },
    delivery_customer: {
      first_name: 'Ppro',
      last_name: 'Test',
      address: {
        address: 'Add 1',
        city: 'City',
        state: 'CA',
        postal_code: '90002',
        country: 'BE'
      }
    }
  };
try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData);
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate Bancontact payment');
    }
  } catch (error) {
    console.error('Bancontact payment initiation failed:', error);
    showError('Error initiating Bancontact payment. Please try again.');
  }
};
const initiateidealPayment = async (basket) => {
const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
const paymentData = {
organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx ideal Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    ideal: {
      account_holder_name: 'Test Name',
      redirection_parameters: {
        return_url: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html'
      } 
    },
    customer: {
      first_name: 'AP',
      last_name: 'Test',
      email: 'test@test.com',
      phone: '01234567890',
      date_of_birth: '1994-08-11',
      address: {
        country: 'DE'
      }
    },
    delivery_customer: {
      first_name: 'Ppro',
      last_name: 'Test',
      address: {
        address: 'Add 1',
        city: 'City',
        state: 'CA',
        postal_code: '90002',
        country: 'DE'
      }
    }
  };
try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData);
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate iDEAL payment');
    }
  } catch (error) {
    console.error('iDEAL payment initiation failed:', error);
    showError('Error initiating iDEAL payment. Please try again.');
  }
};
const displayPaymentOptions = () => {
  const paymentMethods = ['SOFORT', 'Bancontact', 'iDEAL']; // Add more methods as needed
  const paymentOptions = document.createElement('div');
  paymentOptions.setAttribute('id', 'payment-options');
  paymentMethods.forEach(method => {
    const button = document.createElement('button');
    button.textContent = `Pay with ${method}`;
    button.onclick = () => {
      switch (method) {
        case 'SOFORT':
          initiateSofortPayment(basket);
          break;
        case 'Bancontact':
          initiateBancontactPayment(basket);
          break;
        case 'iDEAL':
          initiateidealPayment(basket);
          break;
      }
      paymentOptions.style.display = 'none'; // Hide options after selection
    };
    paymentOptions.appendChild(button);
  });

  const existingOptions = document.getElementById('payment-options');
  if (existingOptions) {
    document.body.replaceChild(paymentOptions, existingOptions);
  } else {
    document.body.appendChild(paymentOptions);
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const basketButton = document.getElementById('cart');
  const backButton = document.getElementById('back-to-products');
  const productsSection = document.querySelector('.products');
  const paymentOptionsSection = document.getElementById('payment-options-page');
  if (paymentOptionsSection) {
    paymentOptionsSection.style.display = 'none';
  }

  // Toggle to payment options view
  basketButton.addEventListener('click', () => {
    if (basket.length > 0) {
      productsSection.style.display = 'none';
      if (paymentOptionsSection) {
        paymentOptionsSection.style.display = 'block';
      }
    } else {
      alert('Your basket is empty.');
    }
  });

  // Back to products view
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (paymentOptionsSection) {
        paymentOptionsSection.style.display = 'none';
      }
      productsSection.style.display = 'flex';
    });
  }

  document.getElementById('confirm-payment').addEventListener('click', async () => {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    switch (selectedMethod) {
      case 'card':
        await initiatePayment(basket);
        break;
      case 'sofort':
        await initiateSofortPayment(basket);
        break;
      case 'bancontact':
        await initiateBancontactPayment(basket);
        break;
      case 'ideal':
        await initiateidealPayment(basket);
        break;
      default:
        console.error('No payment method selected');
    }
  });

  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: parseInt(this.getAttribute('data-amount'), 10)
      };
      basket.push(product);
      updateBasketCount();
    });
  });
});
