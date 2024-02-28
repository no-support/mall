import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/todoApi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken: string, refreshToken: string) => {
  const host = API_SERVER_HOST;

  const header = { headers: { Authorization: `Bearer ${accessToken}` } };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );

  return res.data;
};

// before request
const beforeReq = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig  => {
  const memberInfo = getCookie("member");

  if (!memberInfo || !memberInfo.accessToken) {
    throw new Error("REQUIRE_LOGIN");
  }

  const { accessToken } = memberInfo;

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

const requestFail = (err: any) => {
  return Promise.reject(err);
};

// before return response
const beforeRes = async (res: AxiosResponse<any, any>) => {
  // 'ERROR_ACCESS_TOKEN'
  const data = res.data;

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberCookieValue = getCookie("member");

    const result = await refreshJWT(
      memberCookieValue.accessToken,
      memberCookieValue.refreshToken
    );

    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;

    setCookie("member", JSON.stringify(memberCookieValue), 1);

    // 원래의 호출
    const originalRequest = res.config;
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
    return await axios(originalRequest);
  }

  return res;
};

// fail response
const responseFail = (err: any) => {
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
