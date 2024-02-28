import { selector } from "recoil";
import { atom } from "recoil";
import { CartItemList } from "types";

export const cartState = atom<CartItemList[]>({
  key: `cartState`,
  default: [],
});

export const cartTotalState = selector({
  key: `cartTotalState`,
  get: ({ get }) => {
    const arr = get(cartState);

    const initialValue = 0;

    const total = arr.reduce(
      (total, current) => total + current.price * current.qty,
      initialValue
    );

    return total;
  },
});
