import baseInstance from "./baseInstance";

const apiService = async (
  method: "GET" | "POST",
  endpoint: string,
  payload?: any,
  customHeaders: any = {},
  timeout: number = 120000
) => {
  const config = {
    headers: { ...customHeaders },
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
      return response;
    }
    return response;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error;
  }
};

export default apiService;
