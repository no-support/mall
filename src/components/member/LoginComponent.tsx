import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { FieldValues, useForm } from "react-hook-form";

const LoginComponent = () => {
  const { register, handleSubmit } = useForm();

  const { doLogin, moveToPath } = useCustomLogin();

  const handleClickLogin = (loginParam: FieldValues) => {
    // dispatch(login(loginParam)); // 동기화된 호출
    doLogin(loginParam) // loginSlice의 비동기 호출
      .then((data) => {
        if ('error' in data) {
        alert("아이디와 비밀번호를 확인하세요.")
        } else {
          moveToPath("/");
        }
      })
  };

  return (
    <div className="w-1/2 border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold to-blue-500">Login</div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            type="text"
            {...register("email")}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            type="password"
            {...register("pw")}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
              onClick={handleSubmit(handleClickLogin)}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
      <KakaoLoginComponent />
    </div>
  );
};

export default LoginComponent;
