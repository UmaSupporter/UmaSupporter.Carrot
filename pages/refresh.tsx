import instance from "utils/requester";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { ValidationError } from "utils/error";
import { useAlertContext } from "hooks/useAlertContext";

const Home: NextPage = () => {
  const { alert } = useAlertContext();
  const [uma_id, setUmaId] = useState<string[]>([]);
  const [umaError, setUmaError] = useState<string>("");

  const handleUmaIdChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUmaError("");
    setUmaId(e.target.value.replace(/\D\n/g, "").split("\n"));
  };

  function validate() {
    if (!uma_id) throw new ValidationError("우마 아이디를 입력해주세요.");
  }

  async function updateUma() {
    try {
      validate();
      await instance.post(`/refresh/${uma_id}/uma`);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        setUmaError(e.message);
      } else if (e instanceof Error) {
        alert({
          type: "error",
          title: "Uma의 정보를 수정할 수 없었습니다.",
          message: e.message,
        });
      }
    }
  }

  async function updateCard() {
    try {
      validate();
      await instance.post(`/refresh/${uma_id}/card`);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        setUmaError(e.message);
      } else if (e instanceof Error) {
        alert({
          type: "error",
          title: "Card의 정보를 수정할 수 없었습니다.",
          message: e.message,
        });
      }
    }
  }

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
            placeholder="이곳에 말딸 아이디 입력"
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
