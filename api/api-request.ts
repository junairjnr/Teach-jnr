import axios, { AxiosRequestConfig } from "axios";
import parse from "../utils/json-util";
import { useQuery } from "react-query";
import { getBaseUrl, getUserContext } from "../auth/auth-context";

export const apiRequest = axios.create({
  //baseURL: `${getBaseUrl()}/api/`,
  timeout: 30000,
  headers: {
    "x-app": "schola-react-web-app",
  },
});

apiRequest.interceptors.request.use((config) => {
  config.baseURL = `${getBaseUrl()}api/`;
  const userContext = getUserContext();
  const { access_token, UserId } = parse(userContext);

  if (config.headers) {
    config.headers.Authorization = `Bearer ${access_token}`;
    config.headers.UserId = UserId;
  }
  return config;
});

export const get = (url: string) => apiRequest.get(url);
export const post = (url: string, data: unknown) => apiRequest.post(url, data);
export const put = (url: string, data: unknown) => apiRequest.put(url, data);
export const remove = (url: string, data?: AxiosRequestConfig<any> | undefined) => apiRequest.delete(url, data);
