import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { API_SERVER_HOST } from "../../api/todoApi";
import FetchingModal from "../common/FetchingModal";
import { getList, s3_host } from "../../api/productsApi";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const host = API_SERVER_HOST;

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  // const { exceptionHandle } = useCustomLogin();

  const { moveToLoginReturn } = useCustomLogin();

  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();

  const { isFetching, data, error, isError } = useQuery(
    ["products/list", { page, size, refresh }],
    () => getList({ page, size }),
    { staleTime: 1000 * 5 }
  );

  // const queryClient = useQueryClient(); // 리액트 쿼리 초기화를 위한 현재 객체

  const handleClickPage = (pageParam) => {
    // if (pageParam.page === parseInt(page)) {
    //   queryClient.invalidateQueries("products/list");
    // }
    moveToList(pageParam);
  };

  if (isError) {
    console.log(error);
    return moveToLoginReturn();
  }

  const serverData = data || initState;

  // const [serverData, setServerData] = useState({ ...initState });

  // for FetchingModal
  // const [fetching, setFetching] = useState(false);

  // useEffect(() => {
  //   setFetching(true);
  //   getList({ page, size })
  //     .then((data) => {
  //       console.log(data);
  //       setServerData(data);
  //       setFetching(false);
  //     })
  //     .catch((err) => exceptionHandle(err));
  // }, [page, size, refresh]);

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      <h1>Product List Component</h1>
      {isFetching ? <FetchingModal /> : <></>}

      <div className="flex flex-wrap mx-auto p-6">
        {serverData.dtoList.map((product) => (
          <div
            key={product.pno}
            className="w-1/2 p-1 rounded shadow-md border-2"
            onClick={() => {
              moveToRead(product.pno);
            }}
          >
            <div className="flex flex-col h-full">
              <div className="font-extrabold text-2xl p-2 w-full">
                {product.pno}
              </div>
              <div className="t1xl m-1 p-2 w-full flex flex-col">
                <div className="w-full overflow-hidden">
                  <img
                    alt="product"
                    className="m-auto rounded-md w-60"
                    src={`${s3_host}/s_${product.uploadFileNames[0]}`}
                  />
                </div>

                <div className="bottom-0 font-extrabold bg-white">
                  <div className="text-center p-1">이름 : {product.pname}</div>

                  <div className="text-center p-1">가격 : {product.price}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <PageComponent serverData={serverData} movePage={moveToList} /> */}
      <PageComponent serverData={serverData} movePage={handleClickPage} />
    </div>
  );
};

export default ListComponent;
