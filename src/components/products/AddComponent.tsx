import { useRef, useState } from "react";
import { postAdd } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductForm } from "types";

const initState:ProductForm = {
  pname: "",
  pdesc: "",
  price: 0,
  files: [],
};

const AddComponent = () => {
  // 기본적으로 필요
  const [product, setProduct] = useState({ ...initState });
  const uploadRef = useRef<HTMLInputElement>(null);
  const { moveToList } = useCustomMove();

  // for FetchingModal
  // const [fetching, setFetching] = useState(false);
  // for ResultModal
  // const [result, setResult] = useState(null);

  // 입력값 처리
  const handleChangeProduct = (e :React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const addMutation = useMutation((product: FormData) => postAdd(product));

  const handleClickAdd = () => {
    const files = uploadRef.current?.files;
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    // other data
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price.toString());

    addMutation.mutate(formData);
    // setFetching(true);
    // postAdd(formData).then((data) => {
    //   setFetching(false);
    //   setResult(data.result);
    // });
  };

  const queryClient = useQueryClient();

  const closeModal = () => {
    queryClient.invalidateQueries(["products/list"]);

    // ResultModal 종료
    // setResult(null);
    moveToList(1);
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {addMutation.isLoading ? <FetchingModal /> : <></>}
      {addMutation.isSuccess ? (
        <ResultModal
          title={"Add Result"}
          content={`Add Success ${addMutation.data.result}`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      {/* {fetching ? <FetchingModal /> : <></>} */}
      {/* {result ? (
        <ResultModal
          title={"Product Add Result"}
          content={`${result}번 등록 완료`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )} */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="pname"
            type={"text"}
            value={product.pname}
            onChange={handleChangeProduct}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Desc</div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
            name="pdesc"
            rows={4}
            onChange={handleChangeProduct}
            value={product.pdesc}
          >
            {product.pdesc}
          </textarea>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Price</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="price"
            type={"number"}
            value={product.price}
            onChange={handleChangeProduct}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Files</div>
          <input
            ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type={"file"}
            multiple={true}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative mb-4 flex p-4   flex-wrap items-stretch">
          <button
            type="button"
            className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
            onClick={handleClickAdd}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
