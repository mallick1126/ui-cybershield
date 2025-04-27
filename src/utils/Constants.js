export const CommonContants = {
    oauthCachedKey: "_cachedKey_" + window.location.hostname,
    acTokenKey: "_token_ac_" + window.location.hostname,
    rfTokenKey: "_token_rf_" + window.location.hostname,
    baseURLCyberSheild: "http://localhost:8080/cybershield",
    publicAPIsBaseURLCyberSheild: "http://localhost:8080/cybershield/public"
}

// Error messages
export const errorMessages = {
    NETWORK_ERROR: "Unable to connect to the server. Please check your internet connection.",
    SERVER_ERROR: "An error occurred on the server. Please try again later.",
    TIMEOUT_ERROR: "The request timed out. Please try again.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NOT_FOUND: "The requested resource was not found.",
};