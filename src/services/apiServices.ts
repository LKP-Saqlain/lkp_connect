import baseInstance from "./baseInstance";

// Generic function to handle API calls
const apiService = async (
  method: "GET" | "POST",
  endpoint: string,
  payload?: any,
  customHeaders: any = {},
  timeout: number = 10000 // Default timeout of 10 seconds
) => {
  const config = {
    headers: { ...customHeaders }, // Ensure headers are correctly passed
    timeout: timeout,
  };

  try {
    let response;
    if (method === "GET") {
      response = await baseInstance.get(endpoint, {
        ...config,
        params: payload,
      });
      return response;
    } else if (method === "POST") {
      response = await baseInstance.post(endpoint, payload, config);
      return response; // Return the response data
    }

    return response; // This line is probably unreachable, but can be kept for safety
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error; // Rethrow the error for further handling
  }
};

export default apiService;
