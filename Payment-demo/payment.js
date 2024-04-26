class ApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async sendRequest(endpoint, method = 'POST', requestData = null, endpointType = 'hosted') {
    let baseUrl;
    if (endpointType === 'hosted') {
      baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
    } else if (endpointType === 'bnpl') {
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
function handlePaymentResponse() {
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

  basket = [];
}

const items = [
  {
    product_id: "12345",
    group_id: "stuff",
    item_description: "a thing",
    net_unit_price: 1600,
    gross_unit_price: 1600,
    quantity: 1,
    vat_percent: 0,
    vat_amount: 0,
    discount: 0,
    product_image_url: "https://www.string.com",
    product_url: "https://www.string.com",
    additional_information: "string",
    delivery: "email"
  },
  {
    product_id: "54321",
    group_id: "other stuff",
    item_description: "another thing",
    net_unit_price: 100,
    gross_unit_price: 100,
    quantity: 1,
    vat_percent: 0,
    vat_amount: 0,
    discount: 0,
    product_image_url: "https://www.string.com",
    product_url: "https://www.string.com",
    additional_information: "string",
    delivery: "delivery"
  }
];

const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
const apiClient = new ApiClient(apiKey);
let paymentInitiated = false;
let basket = [];

const updateBasketCount = () => {
  const cartButton = document.getElementById('cart');
  cartButton.textContent = `Basket (${basket.length})`;
};
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');

paymentMethodRadios.forEach(radio => {
  radio.addEventListener('change', handlePaymentMethodChange);
});

const alternativeMethodLogos = document.querySelectorAll('#alternative-methods img');
let selectedAlternativeMethod = null;

alternativeMethodLogos.forEach(logo => {
  logo.addEventListener('click', async () => {
    alternativeMethodLogos.forEach(otherLogo => otherLogo.classList.remove('selected'));
    logo.classList.add('selected');
    selectedAlternativeMethod = logo.alt; // Set selectedAlternativeMethod to the alt attribute

    // Call the respective payment initiation function
    switch (selectedAlternativeMethod.toLowerCase()) {
      case 'ideal':
        await initiateidealPayment(basket);
        break;
      case 'sofort':
        await initiateSofortPayment(basket);
        break;
      case 'klarna':
        await initiateKlarnaPayment();
        break;
      case 'bancontact':
        await initiateBancontactPayment(basket);
        break;
         case 'clearpay':
        await initiateClearpayPayment(basket);
        break;
         case 'sezzle':
        await initiateSezzlePayment();
        break;
      case 'zip':
        await initiateZipPayment(basket);
        break;
         case 'affirm':
        await initiateAffirmPayment(basket);
        break;
      default:
        console.error('Invalid alternative payment method selected');
    }
  });
});

function handlePaymentMethodChange() {
  const alternativeMethodsDiv = document.getElementById('alternative-methods');
  const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;

  if (selectedMethod === 'alternative') {
    alternativeMethodsDiv.style.display = 'block';
  } else {
    alternativeMethodsDiv.style.display = 'none';
    alternativeMethodLogos.forEach(logo => logo.classList.remove('selected'));
    selectedAlternativeMethod = null;
  }
}

const displayPaymentForm = () => {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.style.display = 'block';
  } else {
    console.error('Payment form not found');
  }
};
const initiateKlarnaPayment = async () => {
  const totalAmount = items.reduce((total, item) => total + item.net_unit_price, 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    currency: 'GBP',
    amount: totalAmount,
    net_amount: totalAmount,
    capture_now: 'true',
    dynamic_descriptor: 'Apexx Test',
    merchant_reference: 'jL9ZJMjoYIuFIrH',
    locale: 'EN',
    customer_ip: '127.5.5.1',
    user_agent: 'string',
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bnpl: {
      payment_method: 'klarna',
      payment_type: '',
      payment_type_data: [
        {
          key_name: 'string',
          value: 'string'
        }
      ]
    },
    redirect_urls: {
      success: ' https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?returnUrl=https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html',
      failed: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?status=failed',
      cancelled: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?status=cancelled'
    },
    items: items,
    customer: {
      customer_identification_number: 'string',
      identification_type: 'SSN',
      email: 'jong4@mailinator.com',
      phone: '07777012356',
      salutation: 'Mr',
      type: 'company',
      date_of_birth: '2020-02-02',
      customer_number: 'string',
      gender: 'male',
      employment_type: 'fulltime',
      residential_status: 'homeowner'
    },
    billing_address: {
      first_name: 'Hello',
      last_name: 'Anderson',
      email: 'abc',
      address: 'string',
      city: 'Birmingham',
      state: 'West Mids',
      postal_code: 'B5 1ST',
      country: 'GB',
      phone: '07777123555'
    },
    delivery_address: {
      first_name: 'Tester',
      last_name: 'McTestface',
      phone: '07777132462',
      salutation: 'Mr',
      type: 'company',
      care_of: 'string',
      address: '38 Piccadilly',
      address2: 'string',
      city: 'Bradford',
      state: 'West Yorkshire',
      postal_code: 'BD1 3LY',
      country: 'GB',
      method: 'delivery'
    }
  };

  try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'bnpl');
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate Klarna payment');
    }
  } catch (error) {
    console.error('Klarna payment initiation failed:', error);
    showError('Error initiating Klarna payment. Please try again.');
  }
};
const initiateClearpayPayment = async () => {
  const totalAmount = items.reduce((total, item) => total + item.net_unit_price, 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    currency: 'GBP',
    amount: totalAmount,
    net_amount: totalAmount,
    capture_now: 'true',
    dynamic_descriptor: 'Apexx Test',
    merchant_reference: 'jL9ZJMjoYIuFIrH',
    locale: 'EN',
    customer_ip: '127.5.5.1',
    user_agent: 'string',
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bnpl: {
      payment_method: 'clearpay',
      payment_type: '',
      payment_type_data: [
        {
          key_name: 'string',
          value: 'string'
        }
      ]
    },
    redirect_urls: {
      success: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?returnUrl=https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html',
      failed: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html',
      cancelled: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html'
    },
    items: items,
    customer: {
      customer_identification_number: 'string',
      identification_type: 'SSN',
      email: 'jong4@mailinator.com',
      phone: '07777012356',
      salutation: 'Mr',
      type: 'company',
      date_of_birth: '2020-02-02',
      customer_number: 'string',
      gender: 'male',
      employment_type: 'fulltime',
      residential_status: 'homeowner'
    },
    billing_address: {
      first_name: 'Hello',
      last_name: 'Anderson',
      email: 'abc',
      address: 'string',
      city: 'Birmingham',
      state: 'West Mids',
      postal_code: 'B5 1ST',
      country: 'GB',
      phone: '07777123555'
    },
    delivery_address: {
      first_name: 'Tester',
      last_name: 'McTestface',
      phone: '07777132462',
      salutation: 'Mr',
      type: 'company',
      care_of: 'string',
      address: '38 Piccadilly',
      address2: 'string',
      city: 'Bradford',
      state: 'West Yorkshire',
      postal_code: 'BD1 3LY',
      country: 'GB',
      method: 'delivery'
    }
  };

  try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'bnpl');
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate Clearpay payment');
    }
  } catch (error) {
    console.error('Clearpay payment initiation failed:', error);
    showError('Error initiating Clearpay payment. Please try again.');
  }
};
const initiateZipPayment = async () => {
  const totalAmount = items.reduce((total, item) => total + item.net_unit_price, 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    currency: 'AUD',
    amount: totalAmount,
    net_amount: totalAmount,
    capture_now: 'true',
    dynamic_descriptor: 'Apexx Test',
    merchant_reference: 'jL9ZJMjoYIuFIrH',
    locale: 'EN',
    customer_ip: '127.5.5.1',
    user_agent: 'string',
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bnpl: {
      payment_method: 'zip',
      payment_type: '',
      payment_type_data: [
        {
          key_name: 'string',
          value: 'string'
        }
      ]
    },
    redirect_urls: {
      success: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?returnUrl=https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html',
      failed: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html',
      cancelled: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html'
    },
    items: items,
    customer: {
      customer_identification_number: 'string',
      identification_type: 'SSN',
      email: 'jong4@mailinator.com',
      phone: '07777012356',
      salutation: 'Mr',
      type: 'company',
      date_of_birth: '2020-02-02',
      customer_number: 'string',
      gender: 'male',
      employment_type: 'fulltime',
      residential_status: 'homeowner'
    },
    billing_address: {
      first_name: 'Hello',
      last_name: 'Anderson',
      email: 'abc',
      address: 'string',
      city: 'Birmingham',
      state: 'West Mids',
      postal_code: 'B5 1ST',
      country: 'GB',
      phone: '07777123555'
    },
    delivery_address: {
      first_name: 'Tester',
      last_name: 'McTestface',
      phone: '07777132462',
      salutation: 'Mr',
      type: 'company',
      care_of: 'string',
      address: '38 Piccadilly',
      address2: 'string',
      city: 'Bradford',
      state: 'West Yorkshire',
      postal_code: 'BD1 3LY',
      country: 'GB',
      method: 'delivery'
    }
  };

  try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'bnpl');
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate ZIP payment');
    }
  } catch (error) {
    console.error('ZIP payment initiation failed:', error);
    showError('Error initiating ZIP payment. Please try again.');
  }
};   
const initiateSezzlePayment = async () => {
  const totalAmount = items.reduce((total, item) => total + item.net_unit_price, 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    currency: 'USD',
    amount: totalAmount,
    net_amount: totalAmount,
    capture_now: 'true',
    dynamic_descriptor: 'Apexx Test',
    merchant_reference: 'jL9ZJMjoYIuFIrH',
    locale: 'EN',
    customer_ip: '127.5.5.1',
    user_agent: 'string',
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bnpl: {
      payment_method: 'sezzle',
      payment_type: '',
      payment_type_data: [
        {
          key_name: 'string',
          value: 'string'
        }
      ]
    },
    redirect_urls: {
      success: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html?returnUrl=https://pm-apexx.github.io/Apexx-Playground/Payment-demo/index2.html',
      failed: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html',
      cancelled: 'https://pm-apexx.github.io/Apexx-Playground/Payment-demo/payment-response.html'
    },
    items: items,
    customer: {
      customer_identification_number: 'string',
      identification_type: 'SSN',
      email: 'jong4@mailinator.com',
      phone: '07777012356',
      salutation: 'Mr',
      type: 'company',
      date_of_birth: '2020-02-02',
      customer_number: 'string',
      gender: 'male',
      employment_type: 'fulltime',
      residential_status: 'homeowner'
    },
    billing_address: {
      first_name: 'Hello',
      last_name: 'Anderson',
      email: 'abc',
      address: 'string',
      city: 'Birmingham',
      state: 'West Mids',
      postal_code: 'B5 1ST',
      country: 'US',
      phone: '07777123555'
    },
    delivery_address: {
      first_name: 'Tester',
      last_name: 'McTestface',
      phone: '07777132462',
      salutation: 'Mr',
      type: 'company',
      care_of: 'string',
      address: '38 Piccadilly',
      address2: 'string',
      city: 'Bradford',
      state: 'West Yorkshire',
      postal_code: 'BD1 3LY',
      country: 'US',
      method: 'delivery'
    }
  };

  try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'bnpl');
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      showError('Failed to initiate SEZZLE payment');
    }
  } catch (error) {
    console.error('SEZZLE payment initiation failed:', error);
    showError('Error initiating SEZZLE payment. Please try again.');
  }
}; 
  const initiateCardPayment = async (basket) => {
  if (!paymentInitiated) {
    const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
     if (totalAmount > 30000) {
      showError('The total amount cannot exceed £300.00');
      return;
    }
    const paymentData = {
      organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
      currency: 'GBP',
      amount: totalAmount,
      capture_now: true,
      dynamic_descriptor: 'Apexx Test',
      merchant_reference: 'jL9ZJMjoYIuFIrH',
      return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
      webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
      transaction_type: 'first',
      duplicate_check: false,
      locale: 'en_GB',
      card: {
        create_token: false
      },
      billing_address: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        address: '123 Main Street',
        city: 'London',
        state: 'London',
        postal_code: 'SW1A 1AA',
        country: 'GB',
        phone: '441234567890'
      },
      three_ds: {
        three_ds_required: false,
        three_ds_version: '2.0'
      }
    };
try {
      const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'hosted');
      if (responseData && responseData.url) {
        // Create the payment form dynamically
        const paymentForm = '
          <div class="payment-form-container">
            <h2>Apexx Test Account</h2>
            <p>ref_171405110<span id="random-number"></span></p>

            <label for="card-number">Card Number*</label>
            <input type="text" id="card-number" placeholder="Card Number" required>

            <label for="expiry-month">Expiry Month*</label>
            <select id="expiry-month" required>
              <option value="">MM</option>
              <option value="01">01</option>
              <option value="02">02</option>
              <!-- Add more options for months -->
            </select>

            <label for="expiry-year">Expiry Year*</label>
            <select id="expiry-year" required>
              <option value="">YY</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <!-- Add more options for years -->
            </select>

            <label for="cvv">CVV*</label>
            <input type="text" id="cvv" placeholder="CVV" required>

            <button type="submit">Pay</button>
          </div>
        ';

        // Open the payment form in a new window
        const paymentWindow = window.open('', '_blank', 'width=500,height=600');
        paymentWindow.document.write('
          <html>
            <head>
              <title>Payment Form</title>
              <style>
                /* Add your CSS styles here */
              </style>
            </head>
            <body>
              ${paymentForm}
              <script>
                // Generate a random 8-digit number and display it
                var randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
                document.getElementById("random-number").textContent = randomNumber;

                document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
                  event.preventDefault();
                  window.opener.location.href = 'payment-response.html?status=success';
                  window.close();
                });
              </script>
            </body>
          </html>
        ');
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
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'hosted');
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
    const responseData = await apiClient.sendRequest('', 'POST', paymentData, 'hosted');
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
      showError('Failed to initiate iDEAL payment');
    }
  } catch (error) {
    console.error('iDEAL payment initiation failed:', error);
    showError('Error initiating iDEAL payment. Please try again.');
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
  const selectedMethodRadio = document.querySelector('input[name="payment-method"]:checked');
  if (selectedMethodRadio) {
    const selectedMethod = selectedMethodRadio.value;
    switch (selectedMethod) {
      case 'card':
        await initiateCardPayment(basket);
        break;
      case 'alternative':
        const selectedAlternativeMethod = document.querySelector('#alternative-methods img.selected');
        if (selectedAlternativeMethod) {
          const methodName = selectedAlternativeMethod.alt.toLowerCase(); // Use the alt attribute
          switch (methodName) {
            case 'ideal':
              await initiateidealPayment(basket);
              break;
            case 'sofort':
              await initiateSofortPayment(basket);
              break;
            case 'klarna':
              await initiateKlarnaPayment();
              break;
            case 'bancontact':
              await initiateBancontactPayment(basket);
              break;
              case 'clearpay':
              await initiateClearpayPayment(basket);
              break;
              case 'affirm':
              await initiateAffirmPayment();
              break;
            case 'sezzle':
              await initiateSezzlePayment();
              break;
            case 'zip':
              await initiateZipPayment();
              break;
            default:
              console.error('Invalid alternative payment method selected');
          }
        } else {
          console.error('No alternative payment method selected');
        }
        break;
      default:
        console.error('Invalid payment method selected');
    }
  } else {
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
