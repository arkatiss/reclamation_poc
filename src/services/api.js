import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configPromise } from './config';

const config = await configPromise;
const clientId = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_CLIENT_ID : config.CLIENT_ID;
const clientSecret = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_CLIENT_SECRET : config.CLIENT_SECRET;
const appUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_IS_URL : config.IS_URL;
const baseUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_APIM_URL : config.APIM_URL;
const token = btoa(`${clientId}:${clientSecret}`);
const TIMEOUT = 600000; 
const baseQuery = fetchBaseQuery(
  { baseUrl: baseUrl ,
  prepareHeaders: async (headers,{endpoint}) => {
    
    if (endpoint === 'getAuthorizedLogin') {
      headers.set('Authorization', `Basic ${token}`);
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
    } else if (endpoint !== 'getLoginData' ) {
      // Wait until userData is available in sessionStorage
      let userObj = null;
      let retries = 0;
      while (!userObj && retries < 10) {
        userObj = JSON.parse(sessionStorage.getItem('userData'));
        if (!userObj) {
          await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
          retries++;
        }
      }
      const accessToken = userObj ? userObj[0]?.access_token : null;
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
        // headers.set('Content-Type', 'application/json');
      }
    }
    
    return headers
  }
})
// const isIncluded = array.some(item => value.includes(item));
let isTokenRefreshing = false;

// Token Refresh
const refreshAccessToken = async () => {
  
  isTokenRefreshing = true;
  const payload = new URLSearchParams();
  payload.append('grant_type', 'client_credentials');

  const response = await fetch(`${appUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${token}`,
    },
    body: payload,
  });

  if (response.ok) {
    const data = await response.json();
    let userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    userData = [{ ...userData[0], loginTime: new Date().toLocaleString(), ...data }];
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  isTokenRefreshing = false;
};

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  
  let REQUEST_TIMEOUT = 60000; // 30 seconds
  if(args?.url?.includes('excel_download/download')){
    REQUEST_TIMEOUT = 1200000; // 20 minutes in milliseconds
  }else if((api.getState()?.navigation?.CHILD_MODULE === 'Scan Process' || api.getState()?.navigation?.CHILD_MODULE === 'Scan Error Process' || api.getState()?.navigation?.CHILD_MODULE === 'Rules Definition' ) && args?.url?.includes('customer/get_ind_lookup')){
    REQUEST_TIMEOUT = 300000; // 5 minutes in milliseconds

  }
  // else if(args?.url?.includes('get_ind_lookup')){
  //   REQUEST_TIMEOUT = 60000;
  // }

  const ignoreURLs = [
    'reclamationrules/rest/recRules/', 'elastic/rules_explosion/csreclm', 'rest/commonLookup/getIndLookup', '/lookupservice/rest/commonLookup/',
    'rest/rcmCustService/getFeesByRules','rest/audit/getAudit', 'rest/rcmScan/getScans','reclamationexcelutility/rest/recExcel/fileStatus',
    'reclamationitems/rest/recItem/getItemSum', 'reclamationitems/rest/recItem/getItemWH', 'reclamationitems/rest/recItem/getItemCust',
    'reclamationitems/rest/recItem/getModShipp', "auth/rolesData", "auth/getMenus", "auth/authData", "AccessResource/2022-RCM-PRTL","v1.1/authenticate"
  ];

  if (
    args.body && args.method && args.method.toUpperCase() === 'POST' &&
    !args.url.includes('login') &&
    !ignoreURLs?.some(item => args?.url.includes(item))
  ) {
    let userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const userObj = userData ? userData[0]: {};
    if(userObj){
      Object.assign(args.body,{
        header:{
          channel: "Desktop",
          userName: userObj.email,
          userRole: userObj.roleList,
        },
        PARENT_MODULE:api.getState()?.navigation?.PARENT_MODULE,
        CHILD_MODULE: api.getState()?.navigation?.CHILD_MODULE === 'Store Assignment' ? 'Customer Groups' : api.getState()?.navigation?.CHILD_MODULE,
        DIVISION:api.getState()?.division.id
      });
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn(`Request to ${args.url} timed out after ${REQUEST_TIMEOUT / 1000} seconds.`);
  }, REQUEST_TIMEOUT);

  let PARENT_MODULE = api.getState()?.navigation?.PARENT_MODULE;
  let CHILD_MODULE = api.getState()?.navigation?.CHILD_MODULE;

  try {
    let userObj = JSON.parse(sessionStorage.getItem('userData'));
    // --- Token Refresh Synchronization ---
    // Use a queue to hold requests while token is refreshing
    if (!window.__tokenRefreshQueue) {
      window.__tokenRefreshQueue = [];
    }

    // Helper to wait for token refresh to complete
    const waitForTokenRefresh = () =>
      new Promise((resolve, reject) => {
        window.__tokenRefreshQueue.push({ resolve, reject });
      });

    if (userObj) {
      userObj = userObj[0];

      const region = getTimezoneRegion();
      const locale = region === 'IN' ? 'en-IN' : 'en-US';
      
      const loginTime = parseLoginTime(userObj.loginTime,locale);
      const expiresIn = userObj?.expires_in;
      const tokenExpirationTime = loginTime.getTime() + expiresIn * 1000;
      const currentTime = Date.now();
      
     if (currentTime >= tokenExpirationTime) {
    console.log("Token expired.");
    if (!isTokenRefreshing) {
      isTokenRefreshing = true;
      try {
        await refreshAccessToken();
        window.__tokenRefreshQueue.forEach(({ resolve }) => resolve());
      } catch (err) {
        window.__tokenRefreshQueue.forEach(({ reject }) => reject(err));
      } finally {
        isTokenRefreshing = false;
        window.__tokenRefreshQueue = [];
      }
    } else {
      console.log("Waiting for ongoing token refresh...");
      await waitForTokenRefresh();
    }
  } else if (isTokenRefreshing) {
    console.log("Token is not expired but refresh in progress. Waiting...");
    await waitForTokenRefresh();
  } else {
    console.log("Token is valid.");
  }

    }

    const result = await baseQuery({ ...args, signal: controller.signal }, api, extraOptions);
    if (result?.error?.status === "FETCH_ERROR") {
      let statusCode = result?.error?.originalStatus === undefined ? "TIMEOUT" : result?.error?.status;
      let statusMessage = "";
      let responseFlag = undefined;
      const event = new CustomEvent('interceptorEvent', { detail: {statusCode ,module:PARENT_MODULE+" "+CHILD_MODULE,url:args?.url,statusMessage,responseFlag}});
      window.dispatchEvent(event);
    }
    const statusCode = result?.data?.status_code || result?.error?.data?.status_code;
    const statusMessage = result?.data?.msg || result?.error?.data?.msg;
    let responseFlag;
    if (result?.error?.data?.res_status === undefined) {
      responseFlag = result?.data?.res_status;
    } else {
      responseFlag = result?.error?.data?.res_status;
    }
    if (statusCode) {
      const event = new CustomEvent('interceptorEvent', { detail: {statusCode ,module:PARENT_MODULE+" "+CHILD_MODULE,url:args?.url,statusMessage,responseFlag}});
      window.dispatchEvent(event);

      switch (statusCode) {
        case 200:
        case 201:
        case 202:
        case 204:
          return result;
        case 400:
          throw new Error("Bad request. Please check your input and try again.");
        case 401:
          throw new Error("Unauthorized access. Please log in again.");
        case 403:
          throw new Error("You don't have permission to perform this action.");
        case 404:
          throw new Error("The requested resource was not found.");
        case 500:
          throw new Error("Internal server error. Please try again later.");
        case 502:
          throw new Error("Bad gateway. The server is temporarily unavailable.");
        case 503:
          throw new Error("Service unavailable. Please try again later.");
        case 504:
          throw new Error("Gateway timeout. Please try again later.");
        default:
          throw new Error(`Unexpected error occurred. Status code: ${statusCode}`);
      }
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      
      console.error('Request timed out:', args.url);
      const timeoutError = { error: { status: 'TIMEOUT', message: 'Request timed out' } };
      const event = new CustomEvent('interceptorEvent', { detail: timeoutError.error.status });
      window.dispatchEvent(event);
      return timeoutError;
    }
    if (error instanceof TypeError) {
      console.error('Network error occurred:', args.url);
      const networkError = { error: { status: 'NETWORK_ERROR', message: 'Network error occurred' } };
      const event = new CustomEvent('interceptorEvent', { detail: networkError.error.status });
      window.dispatchEvent(event);
      return networkError;
    }
    console.error('Unexpected error:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});


function getTimezoneRegion() {
  const offset = new Date().getTimezoneOffset();
  if (offset === -330) return 'IN';
  return 'US'; 
}

function parseLoginTime(dateStr, forcedLocale = null) {
  if (!dateStr) return new Date(NaN);

  // Example: "23/6/2025, 12:08:30 pm"
  const [datePart, timePartRaw] = dateStr.split(", ");
  if (!datePart || !timePartRaw) return new Date(NaN);

  const [a, b, c] = datePart.split("/").map(Number);
  let day, month, year = c;

  const locale = forcedLocale || navigator.language || 'en-IN';

  if (a > 12) {
    day = a;
    month = b;
  } else if (b > 12) {
    month = a;
    day = b;
  } else {
    if (locale.startsWith('en-US')) {
      month = a;
      day = b;
    } else {
      day = a;
      month = b;
    }
  }

  let [time, ampm] = timePartRaw.split(" ");
  let [hour, minute, second] = time.split(":").map(Number);

  if (ampm && ampm.toLowerCase() === "pm" && hour < 12) hour += 12;
  if (ampm && ampm.toLowerCase() === "am" && hour === 12) hour = 0;

  // Defensive: check for NaN
  if ([year, month, day, hour, minute, second].some(isNaN)) {
    console.error("parseLoginTime: Invalid date parts", { year, month, day, hour, minute, second, dateStr });
    return new Date(NaN);
  }
  
    // JS months are 0-based
  return new Date(year, month - 1, day, hour, minute, second);
}