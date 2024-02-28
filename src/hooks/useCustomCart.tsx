import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartState";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { getCartItems, postChangeCart } from "../api/cartApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CartItem } from "types";

const useCustomCart = () => {
  const [cartItems, setCartItems] = useRecoilState(cartState);

  const queryClient = useQueryClient();

  const changeMutation = useMutation((param:CartItem) => postChangeCart(param), {
    onSuccess: (result) => {
      setCartItems(result);
    },
  });

  const query = useQuery(["cart"], getCartItems, {
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (query.isSuccess || changeMutation.isSuccess) {
      queryClient.invalidateQueries(["cart"]);
      if (query.data) {
        setCartItems(query.data);
      }
    }
  }, [query.isSuccess, query.data]);

  // const cartItems = useSelector((state) => state.cartSlice);

  // const dispatch = useDispatch();

  // const refreshCart = () => {
  //   dispatch(getCartItemsAsync());
  // };

  const changeCart = (param:CartItem) => {
    changeMutation.mutate(param);
    // dispatch(postChangeCartAsync(param));
  };
  return { cartItems, changeCart };
};

export default useCustomCart;
