import { useForm } from "react-hook-form";
import { joinMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";

const JoinComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      pw: "",
      pwConfirm: "",
      nickname: "",
    },
    mode: "all",
  });

  const { moveToPath } = useCustomLogin();

  const handleClickJoin = (formData) => {
    const { pwConfirm, ...member } = formData;
    member.roleNames = ["USER"];

    joinMember(member).then((result) => {
      if (result.error) {
        alert("회원가입 실패");
      } else {
        alert("회원가입 성공");
        moveToPath("/member/login");
      }
    });
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold to-blue-500">Join</div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4  w-full items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type="text"
            {...register("email", {
              required: "Email(은)는 필수 입력값입니다.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "이메일 형식이 아닙니다.",
              },
            })}
          ></input>
          {errors.email && (
            <p role="alert" className="text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className=" justify-center">
        <div className="relative mb-4  w-full items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type="password"
            {...register("pw", {
              required: "Password(은)는 필수 입력값입니다.",
              minLength: {
                value: 4,
                message: "4자 이상 입력하세요",
              },
            })}
          ></input>
          {errors.pw && (
            <p role="alert" className="text-red-500">
              {errors.pw.message}
            </p>
          )}
        </div>
      </div>

      <div className=" justify-center">
        <div className="relative mb-4  w-full items-stretch">
          <div className="w-full p-3 text-left font-bold">Password Confirm</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pwConfirm"
            type="password"
            {...register("pwConfirm", {
              required: "Password Confirm(은)는 필수 입력값입니다.",
              validate: (value) =>
                value === watch("pw") || "비밀번호가 일치하지 않습니다.",
            })}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
          ></input>
          {errors.pwConfirm && (
            <p role="alert" className="text-red-500">
              {errors.pwConfirm.message}
            </p>
          )}
        </div>
      </div>

      <div className=" justify-center">
        <div className="relative mb-4  w-full items-stretch">
          <div className="w-full p-3 text-left font-bold">Nickname</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="nickname"
            type="text"
            {...register("nickname", {
              required: "Nickname(은)는 필수 입력값입니다.",
            })}
          ></input>
          {errors.nickname && (
            <p role="alert" className="text-red-500">
              {errors.nickname.message}
            </p>
          )}
        </div>
      </div>

      <div className=" justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
              onClick={handleSubmit(handleClickJoin)}
            >
              JOIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinComponent;
