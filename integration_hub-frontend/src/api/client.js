const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1';

/**
 * A central utility for making API requests.
 * Automatically handles base URLs, JSON parsing, and authentication tokens.
 */
// ...customConfig - rest operator packs remaining properties into a new variable
const client = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('authToken');
  
  let headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const finalHeaders = { ...headers, ...customConfig.headers };
  
  const method = customConfig.method || (body ? 'POST' : 'GET');
  
  const config = {
    ...customConfig, // Spread any extra options (like credentials, mode, etc.)
    method,          // Use our explicitly determined method
    headers: finalHeaders
  };

  // Only attach a body to the config if one was provided
  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Attempt to parse JSON response
    try {
        data = await response.json();
    } catch (e) {
        // Response might not be JSON (e.g., 204 No Content)
        data = null;
    }

    if (response.ok) {
      // The API usually wraps responses in { data: ... }, but we'll return the whole parsed body
      // so specific api functions can decide what to extract.
      return data;
    }

    // Handle error responses from the server
    const errorMessage = data?.message || data?.error || 'An error occurred during the request.';
    return Promise.reject(new Error(errorMessage)); // to force the client function to trigger catch in the caller
    
  } catch (error) {
    // Handle network errors (e.g., server down, CORS issues)
    console.error('API Client Error:', error);
    return Promise.reject(error);
  }
};

export default client;