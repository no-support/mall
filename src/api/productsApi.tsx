import { API_SERVER_HOST } from "./todoApi";
import jwtAxios from "../util/jwtUtil";
import { PageRequest, Product, ProductPnoType } from "types";

const host = `${API_SERVER_HOST}/api/products`;

export const s3_host =
  "https://elasticbeanstalk-ap-northeast-2-639578488701.s3.ap-northeast-2.amazonaws.com";

export const postAdd = async (product:FormData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  // 경로 뒤 '/' 주의
  const res = await jwtAxios.post(`${host}/`, product, header);

  return res.data;
};

export const getList = async (pageParam: PageRequest) => {
  const { page, size } = pageParam;

  const res = await jwtAxios.get(`${host}/list`, { params: { page, size } });

  return res.data;
};

export const getOne = async (pno: ProductPnoType) => {
  const res = await jwtAxios.get(`${host}/${pno}`);

  return res.data;
};

export const putOne = async (pno: ProductPnoType, product: FormData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const res = await jwtAxios.put(`${host}/${pno}`, product, header);

  return res.data;
};

export const deleteOne = async (pno: ProductPnoType) => {
  const res = await jwtAxios.delete(`${host}/${pno}`);

  return res.data;
};
