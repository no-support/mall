import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { getCookie, removeCookie, setCookie } from "../util/cookieUtil";

const initState = {
  email: "",
};

const loadMemberCookie = () => {
  // 쿠키에서 로그인 정보 로딩
  const memberInfo = getCookie("member");

  // 닉네임 처리
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }
  return memberInfo;
};

export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState, // 쿠키가 없다면 초깃값 사용
  reducers: {
    login: (state, action) => {
      // {소셜 로그인 회원이 사용}
      const payload = action.payload;

      setCookie("member", JSON.stringify(payload), 1); // 1일

      return payload;

      // {email, pw로 구성}
      // const data = action.payload;
      // 새로운 상태
      // return { email: data.email };
    },
    logout: (state, action) => {
      removeCookie("member");
      return { ...initState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        const payload = action.payload;

        // 정상적인 로그인 시에만 저장
        if (!payload.error) {
          setCookie("member", JSON.stringify(payload), 1); // 1일
        }
        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {})
      .addCase(loginPostAsync.rejected, (state, action) => {});
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
