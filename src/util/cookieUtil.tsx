import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days); // 보관기한
  return cookies.set(name, value, { path: "/", expires });
};

export const getCookie = (name: string): any => {
  return cookies.get(name);
};

export const removeCookie = (name: string, path = "/"): void => {
  return cookies.remove(name, { path });
};
