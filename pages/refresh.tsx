import instance from "utils/requester";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { ValidationError } from "utils/error";
import { useAlertContext } from "hooks/useAlertContext";
import { chain } from "utils/chain";

const Home: NextPage = () => {
  const { alert } = useAlertContext();
  const [uma_id, setUmaId] = useState<string[]>([]);
  const [umaError, setUmaError] = useState<string>("");

  const handleUmaIdChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUmaError("");
    setUmaId(e.target.value.replace(/\D\n/g, "").split("\n"));
  };

  async function updateData(uma_id: string, endpoint: "uma" | "card") {
    try {
      if (!uma_id) throw new ValidationError("우마 아이디를 입력해주세요.");
    } catch (e) {
      if (e instanceof ValidationError) {
        setUmaError(e.message);
      }
    }

    try {
      await instance.post(`/refresh/${uma_id}/${endpoint}`);
      alert({
        type: "success",
        title: `${uma_id}의 정보를 업데이트 했습니다!`,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof Error)
        alert({
          type: "error",
          title: `${uma_id}의 정보를 업데이트 하는중 오류가 발생했습니다!`,
          message: e.message,
        });
      throw e;
    }
  }

  const updateUma = () => chain(uma_id, updateData, "uma");

  const updateCard = () => chain(uma_id, updateData, "card");

  async function updateAll() {
    await updateUma();
    await updateCard();
  }

  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-3xl font-black"}>우마 데이터 업데이트 하기</h1>
      <p className={"text-xl"}>우마 아이디를 입력하고 버튼을 눌러보세요.</p>

      <div className={"py-4"}>
        <div className="form-control">
          <div className="label">
            <span className="label-text">우마 아이디 입력</span>
          </div>
          <textarea
            value={uma_id.join("\n")}
            onChange={handleUmaIdChange}
            className={["textarea textarea-bordered w-full max-w-md", umaError ? "textarea-error" : ""].join(" ")}
            placeholder={"이곳에 말딸 아이디를 입력하세요.\n한줄에 하나의 말딸 아이디를 입력할 수 있습니다."}
          />
          <div className="label">
            <span className="label-text-alt text-error">{umaError}</span>
          </div>
        </div>
        <div className="form-control">
          <div className="label">
            <span className="label-text">어떻게 하실거에요?</span>
          </div>
          <div className="flex gap-2">
            <button onClick={updateCard} type="button" className={"btn btn-active btn-primary"}>
              카드 업데이트
            </button>
            <button onClick={updateUma} type="button" className={"btn btn-active btn-primary"}>
              우마 업데이트
            </button>
            <button onClick={updateAll} type="button" className={"btn btn-active btn-primary"}>
              싹다 업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
