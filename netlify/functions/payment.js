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

const initiateKlarnaPayment = async (apiClient, items) => {
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
      return { url: responseData.url };
    } else {
      throw new Error('Failed to initiate Klarna payment');
    }
  } catch (error) {
    throw new Error('Klarna payment initiation failed: ' + error.message);
  }
};

const initiateClearpayPayment = async (apiClient, items) => {
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
      return { url: responseData.url };
    } else {
      throw new Error('Failed to initiate Clearpay payment');
    }
  } catch (error) {
    throw new Error('Clearpay payment initiation failed: ' + error.message);
  }
};

// Exported handler for Netlify function
exports.handler = async (event, context) => {
  // Check if the request method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Parse the request body
  const requestData = JSON.parse(event.body);

  // Initialize the API client
  const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
  const apiClient = new ApiClient(apiKey);

  let responseData;
  try {
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
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Payment failed', error: error.message }),
    };
  }
};

