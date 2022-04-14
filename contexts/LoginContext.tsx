import { createContext, FC, FormEvent, useState } from "react";
import { FormElement } from "types/formElement";
import instance from "utils/requester";
import { useAlertContext } from "hooks/useAlertContext";
import { getCookie } from "cookies-next";
import useAsyncEffect from "use-async-effect";

interface ILoginContext {
  isLogin: boolean;
  logout(): void;
}

const doNothing = () => null;

export const LoginContext = createContext<ILoginContext>({
  isLogin: false,
  logout: doNothing,
});

const LoginContextProvider: FC = ({ children }) => {
  const { push } = useAlertContext();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [idError, setIdError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  useAsyncEffect(async () => {
    // early return when user login
    if (isLogin) return;

    const token = getCookie("token");

    // early return when token is undefined
    if (!token) return;

    // do login with token
    try {
      await instance.get("/auth/ping");
      login();
    } catch (e) {
      console.error(e);
    }
  }, [isLogin]);

  async function handleSubmit(event: FormEvent<FormElement>) {
    event.preventDefault();

    const {
      id: { value: id },
      password: { value: password },
    } = event.currentTarget.elements;

    let errored: boolean = false;

    if (!id) {
      setIdError("아이디를 입력해주세요.");
      errored = true;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      errored = true;
    }

    if (errored) return;

    try {
      await instance.post("/auth/login", {
        id,
        password,
      });

      login();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        push({
          type: "error",
          title: "로그인에 실패했습니다.",
          message: "아이디 / 비밀번호가 일치하지 않습니다.",
        });
      }
    }
  }

  const login = () => {
    push({
      type: "success",
      title: "성공적으로 로그인되었습니다.",
    });
    setLogin(true);
  };
  const logout = () => setLogin(false);

  if (!isLogin) {
    return (
      <div className={"hero h-screen"}>
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className={"text-3xl font-black"}>UmaSupporter.Carrot 🥕</h1>
          </div>
          <form onSubmit={handleSubmit} className={"card w-full max-w-sm shadow-2xl p-8"}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">아이디</span>
              </label>
              <input
                type="text"
                placeholder="ID"
                id="id"
                onChange={() => setIdError("")}
                className={["input input-bordered", idError ? "input-error" : ""].join(" ")}
              />
              <label className="label">
                <span className="label-text-alt text-error">{idError}</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">비밀번호</span>
              </label>
              <input
                type="password"
                placeholder="password"
                id="password"
                onChange={() => setPasswordError("")}
                className={["input input-bordered", passwordError ? "input-error" : ""].join(" ")}
              />
              <label className="label">
                <span className="label-text-alt text-error">{passwordError}</span>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">로그인</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
