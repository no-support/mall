import { PageRequest, SimpleTodo, Todo } from "types";
import jwtAxios from "../util/jwtUtil";

let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
  backendHost = "http://localhost:5000";
} else {
  backendHost = "https://backend.no-support.site";
}

export const API_SERVER_HOST = `${backendHost}`;

const prefix = `${API_SERVER_HOST}/api/todo`;

export const getOne = async (tno: number) => {
  const res = await jwtAxios.get<Todo>(`${prefix}/${tno}`);
  return res.data;
};

export const getList = async (pageParam: PageRequest) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

export const postAdd = async (todoObj: SimpleTodo) => {
  const res = await jwtAxios.post(`${prefix}/`, todoObj);
  return res.data;
};

export const deleteOne = async (tno: number) => {
  const res = await jwtAxios.delete(`${prefix}/${tno}`);
  return res.data;
};

export const putOne = async (todo: Todo) => {
  const res = await jwtAxios.put(`${prefix}/${todo.tno}`, todo);
  return res.data;
};
