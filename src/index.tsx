import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <Provider store={store}>
  <RecoilRoot>
    <App />
  </RecoilRoot>
  // </Provider>
);
