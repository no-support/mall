import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
// import { PageRequest } from "types";

const getNum = (param: string | number | undefined | null, defaultValue: number):number => {
  if (!param) {
    return defaultValue;
  }
  if (typeof param === "number") {
    return param;
  }
  return parseInt(param);
};

const useCustomMove = () => {
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false);

  const [queryParams] = useSearchParams();

  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);

  const queryDefault = createSearchParams({ page: page.toString(), size: size.toString()}).toString();

  const moveToList = (pageParam?: number) => {
    let queryStr = "";
    if (pageParam) {
      // const pageNum = getNum(pageParam.page, 1);
      // const pageSize = getNum(pageParam?.size, 10);

      queryStr = createSearchParams({
        page: pageParam.toString(),
        size: '10',
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    setRefresh(!refresh);
    navigate({ pathname: `../list`, search: queryStr });
  };

  const moveToModify = (num: string) => {
    navigate({ pathname: `../modify/${num}`, search: queryDefault });
  };

  const moveToRead = (num: number) => {
    navigate({ pathname: `../read/${num}`, search: queryDefault });
  };

  return { moveToList, moveToModify, moveToRead, page, size, refresh };
};

export default useCustomMove;
