import Cookies from 'js-cookie';
import { CommonContants } from './Constants';

export function setTokenInCookies(responseData) {
    // set access token in cookies
    let acTokenKey = CommonContants.acTokenKey;
    let acTokenValue = responseData.accessToken;
    let acTokenExpiry = new Date(responseData.acExpiresIn);
    let acTokenExpiryInDays = (acTokenExpiry.getTime() - Date.now()) / 1000 * 60 * 60 * 24;
    Cookies.set(acTokenKey, acTokenValue, {
        domain: window.location.hostname,
        expires: acTokenExpiryInDays
    });

    // set refresh token in cookies
    let rfTokenKey = CommonContants.rfTokenKey;
    let rfTokenValue = responseData.refreshToken;
    let rfTokenExpiry = new Date(responseData.rfExpiresIn);
    let rfTokenExpiryInDays = (rfTokenExpiry.getTime() - Date.now()) / 1000 * 60 * 60 * 24;
    Cookies.set(rfTokenKey, rfTokenValue, {
        domain: window.location.hostname,
        expires: rfTokenExpiryInDays
    });
}