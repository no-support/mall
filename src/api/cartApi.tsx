import { CartItem, CartItemList } from "types";
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./todoApi";

const host = `${API_SERVER_HOST}/api/cart`;

export const getCartItems = async (): Promise<CartItemList[]> => {
  const res = await jwtAxios.get<CartItemList[]>(`${host}/items`);
  return res.data;
};

export const postChangeCart = async (cartItem: CartItem):Promise<CartItemList[]> => {
  const res = await jwtAxios.post<CartItemList[]>(`${host}/change`, cartItem);
  return res.data;
};