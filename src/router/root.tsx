import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import todoRouter from "./todoRouter";
import productsRouter from "./productsRouter";
import memberRouter from "./memberRouter";

const Loading = <div>Loading....</div>;

const Main = lazy(() => import("../pages/MainPage"));
const TodoIndex = lazy(() => import("../pages/todo/IndexPage"));
const ProductIndex = lazy(() => import("../pages/products/IndexPage"));

const root = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: "todo",
    element: (
      <Suspense fallback={Loading}>
        <TodoIndex />
      </Suspense>
    ),
    children: todoRouter(),
  },
  {
    path: "products",
    element: (
      <Suspense fallback={Loading}>
        <ProductIndex />
      </Suspense>
    ),
    children: productsRouter(),
  },
  {
    path: "member",
    children: memberRouter(),
  },
]);

export default root;