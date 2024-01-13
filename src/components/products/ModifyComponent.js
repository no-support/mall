import { useEffect, useRef, useState } from "react";
import { getOne, putOne, deleteOne, s3_host } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  delFlag: false,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ModifyComponent = ({ pno }) => {
  // 결과 모달
  // const [result, setResult] = useState(null);

  // const [fetching, setFetching] = useState(false);

  // 이동용 함수
  const { moveToRead, moveToList } = useCustomMove();
  const [product, setProduct] = useState(initState);

  const uplodaRef = useRef();

  const query = useQuery(["products", pno], () => getOne(pno), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setProduct(query.data);
    }
    // setFetching(true);
    // getOne(pno).then((data) => {
    //   setProduct(data);
    //   setFetching(false);
    // });
  }, [pno, query.data, query.isSuccess]);

  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value;
    setProduct({ ...product });
  };

  const deleteOldImages = (imageName) => {
    const resultFileNames = product.uploadFileNames.filter(
      (fileName) => fileName !== imageName
    );
    product.uploadFileNames = resultFileNames;
    setProduct({ ...product });
  };

  const modMutation = useMutation((product) => putOne(pno, product));

  const handleClickModify = () => {
    const files = uplodaRef.current.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    // other data
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);
    formData.append("delFlag", product.delFlag);

    for (let i = 0; i < product.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", product.uploadFileNames[i]);
    }

    modMutation.mutate(formData);

    // fetching
    // setFetching(true);

    // putOne(pno, formData).then((data) => {
    //   setResult("Modified");
    //   setFetching(false);
    // });
  };

  const delMutation = useMutation((pno) => deleteOne(pno));

  const queryClient = useQueryClient();

  const handleClickDelete = () => {
    delMutation.mutate(pno);
    // setFetching(true);
    // deleteOne(pno).then((data) => {
    //   setResult("Deleted");
    //   setFetching(false);
    // });
  };

  const closeModal = () => {
    if (delMutation.isSuccess) {
      queryClient.invalidateQueries(["products", pno]);
      queryClient.invalidateQueries("products/list");
      moveToList();
      return;
    }
    if (modMutation.isSuccess) {
      queryClient.invalidateQueries(["products", pno]);
      queryClient.invalidateQueries("products/list");
      moveToRead(pno);
    }

    // if (result === "Modified") {
    //   moveToRead(pno); // 조회 화면으로 이동
    // } else if (result === "Deleted") {
    //   moveToList({ page: 1 });
    // }
    // setResult(null);
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {query.isFetching || delMutation.isLoading || modMutation.isLoading ? (
        <FetchingModal />
      ) : (
        <></>
      )}
      {delMutation.isSuccess || modMutation.isSuccess ? (
        <ResultModal
          title={"처리 결과"}
          content={"정상적으로 처리되었습니다"}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      {/* {fetching ? <FetchingModal /> : <></>}
      {result ? (
        <ResultModal
          title={`${result}`}
          content={"정상적으로 처리되었습니다"}
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
            rows="4"
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
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md "
            name="price"
            type={"number"}
            value={product.price}
            onChange={handleChangeProduct}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">DELETE</div>
          <select
            name="delFlag"
            value={product.delFlag}
            onChange={handleChangeProduct}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
          >
            <option value={false}>사용</option>
            <option value={true}>삭제</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Files</div>
          <input
            ref={uplodaRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md "
            type={"file"}
            multiple={true}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Images</div>
          <div className="w-4/5 justify-center flex flex-wrap items-start">
            {product.uploadFileNames.map((imgFile, i) => (
              <div
                className="flex justify-center flex-col w-1/3 m-1 align-baseline"
                key={i}
              >
                <button
                  className="bg-blue-500 text-3xl text-white"
                  onClick={() => {
                    deleteOldImages(imgFile);
                  }}
                >
                  DELETE
                </button>

                <img src={`${s3_host}/s_${imgFile}`} alt="img" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 to-white bg-red-500"
          onClick={handleClickDelete}
        >
          Delete
        </button>

        <button
          type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32 to-white bg-orange-500"
          onClick={handleClickModify}
        >
          Modify
        </button>

        <button
          type="button"
          className=" rounded p-4 m-2 text-xl w-32 to-white bg-blue-500"
          onClick={moveToList}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
