//import { SCHOLA_ACTIVE_INSTITUTE } from "../modules/customer-admin/util";
"use client";

export const STORAGE_KEYS = {
  USER_CONTEXT: "schola_user_context",
  BASE_URL: "schola_base_url",
  CUSTOMERID: "schola_customerid",
  DEVICEID: "schola_deviceid",
  HOURS: "schola_hour_count",
};
export const getUserContext = () => {
  // if user is not checked remember me, then token is stored inside sessionStorage
  return get(STORAGE_KEYS.USER_CONTEXT);
};

export const storeUserContext = (loginResponse: {}) => {
  localStorage.setItem(
    STORAGE_KEYS.USER_CONTEXT,
    JSON.stringify(loginResponse)
  );
};
export const storeHourCount = (url: string) => {
  localStorage.setItem(STORAGE_KEYS.HOURS, url);
};
export const getHourCount = () => {
  return get(STORAGE_KEYS.HOURS) || "";
};

export const storeBaseUrl = (url: string) => {
  localStorage.setItem(STORAGE_KEYS.BASE_URL, url);
};
export const getBaseUrl = () => {
  return get(STORAGE_KEYS.BASE_URL) || "";
};

export const storeCustomerId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOMERID, id);
};

export const getCustomerId = () => {
  return get(STORAGE_KEYS.CUSTOMERID);
};

export const storeDeviceId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.DEVICEID, id);
};

export const getDviceId = () => {
  return get(STORAGE_KEYS.DEVICEID);
};


const get = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }
  return localStorage.getItem(key);
};
export const removeUserContext = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_CONTEXT);
  localStorage.removeItem(STORAGE_KEYS.BASE_URL);
  localStorage.removeItem(STORAGE_KEYS.CUSTOMERID);
  localStorage.removeItem(STORAGE_KEYS.DEVICEID);
};