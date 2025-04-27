import axios from "axios";
import Cookies from 'js-cookie';
import { setTokenInCookies } from "./TokenUtil";
import { CommonContants } from "./Constants";
import { getErrosFromAPIres } from "./commonUtils";
import { endpoints } from "./endpoints";

// Create axios instance with default config
export const api = axios.create({
  baseURL: CommonContants.baseURLCyberSheild,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
//The interceptor is particularly useful when you need to add something to every request automatically, rather than adding it manually each time you make an API call.
api.interceptors.request.use(
  async (config) => {
    let fullUrl = config.baseURL + config.url;
    if (fullUrl.startsWith(CommonContants.publicAPIsBaseURLCyberSheild)) {
      console.log("public api call no need to add the access token");
      return config;
    }

    let acTokenKey = "_token_ac_" + window.location.hostname;
    if (Cookies.get(acTokenKey)) {
      let acTokenValue = Cookies.get(acTokenKey);
      config.headers.Authorization = `Bearer ${acTokenValue}`;
      console.log("authorised api call added access token from the cookies")
      return config;
    }

    let rfTokenKey = "_token_rf_" + window.location.hostname;
    if (Cookies.get(rfTokenKey)) {
      let rfToken = Cookies.get(rfTokenKey);
      const payload = {
        refreshToken: rfToken
      }
      const res = await endpoints.auth.login(payload);
      const responseData = res?.data?.responseData;
      setTokenInCookies(responseData);

      let acTokenValue = Cookies.get(acTokenKey);
      config.headers.Authorization = `Bearer ${acTokenValue}`;
      console.log("Succesfully refreshed the tokens by calling api and added in authorisation headers")
    };

    return config;
  },
  (error) => {
    console.log("Failed to call the API : ", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use((response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:{
          // Unauthorized - usually means user needs to login
          console.error("Something went wrong from client side:", error.response.data.errorData.errorMessage);
          return Promise.reject(getErrosFromAPIres(error.response.data));
        }  
        case 401:{
          // Unauthorized - usually means user needs to login
          console.error("Unauthorized access - refreshing if refresh token exists to login");
          window.location.href = "/auth/login";
          return Promise.reject("Redirect to login page !");
        }
        case 403:{
          // Forbidden - user doesn't have necessary permissions
          console.error("Access forbidden");
          return Promise.reject(
            "You do not have permission to access this resource."
          );
        }
        case 404:{
          // Not Found - requested resource doesn't exist
          console.error("Resource not found");
          return Promise.reject("The requested resource was not found.");
        }
        case 500:{
          // Server Error
          console.error("Server error occurred:", error.response.data);
          return Promise.reject(
            "An internal server error occurred. Please try again later."
          );
        }
        default:{
          // Other error status codes
          console.error(
            "Request failed:",
            error.response.status,
            error.response.data
          );
          return Promise.reject(
            "An unexpected error occurred. Please try again."
          );
        }
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error - no response received:", error.request);
      return Promise.reject(
        "Unable to connect to the server. Please check your internet connection."
      );
    } else {
      // Request setup error
      console.error("Error setting up request:", error.message);
      return Promise.reject("Failed to send request. Please try again.");
    }
  }
);


// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return CommonContants.errorMessages.UNAUTHORIZED;
      case 404:
        return CommonContants.errorMessages.NOT_FOUND;
      case 500:
        return CommonContants.errorMessages.SERVER_ERROR;
      default:
        return `An error occurred: ${error.response.data.message || "Unknown error"
          }`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    if (error.code === "ECONNABORTED") {
      return CommonContants.errorMessages.TIMEOUT_ERROR;
    }
    return CommonContants.errorMessages.NETWORK_ERROR;
  } else {
    // Something happened in setting up the request that triggered an Error
    return "An error occurred while setting up the request.";
  }
};

export default api;
