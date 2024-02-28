import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const { moveToPath, saveAsCookie } = useCustomLogin();

  // const dispatch = useDispatch();

  const authCode = searchParams.get("code");

  useEffect(() => {
    if (!authCode) {
      moveToPath("/");
      return;
    }
    getAccessToken(authCode).then((accessToken) => {
      getMemberWithAccessToken(accessToken).then((memberInfo) => {
        // dispatch(login(memberInfo));

        saveAsCookie(memberInfo);
        // 소셜 회원이 아니라면
        if (memberInfo && !memberInfo.social) {
          moveToPath("/");
        } else {
          moveToPath("/member/modify");
        }
      });
    });
  }, [authCode]);

  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
