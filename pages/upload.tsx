import instance from "utils/requester";
import type { NextPage } from "next";
import { useAlertContext } from "hooks/useAlertContext";
import { ChangeEvent, FormEvent, Reducer, useReducer } from "react";
import Image from "next/image";
import { FormElement } from "types/formElement";
import { formatBytes } from "utils/formatBytes";
import { fileToFormData } from "utils/fileToFormData";
import produce from "immer";
import axios from "axios";
import { useModalContext } from "hooks/useModalContext";

enum UploadStatus {
  PENDING = "pending",
  UPLOAD = "primary",
  SUCCESS = "success",
  ERROR = "error",
}

interface IFilesMeta {
  file: File;
  image: string;
  name: string;
  size: string;
  progress: number;
  status: UploadStatus;
}

type Actions =
  | {
      type: "changeStatus";
      index: number;
      status: UploadStatus;
    }
  | {
      type: "changeProgress";
      index: number;
      progress: number;
    }
  | {
      type: "setFiles";
      files: IFilesMeta[];
    }
  | {
      type: "deleteFile";
      name: string;
    };

const reducer: Reducer<IFilesMeta[], Actions> = (draft, action) => {
  switch (action.type) {
    case "changeStatus":
      draft[action.index].status = action.status;
      break;
    case "changeProgress":
      draft[action.index].progress = action.progress;
      break;
    case "setFiles":
      return action.files;
    case "deleteFile":
      const index = draft.findIndex((file) => file.name === action.name);
      if (index !== -1) {
        URL.revokeObjectURL(draft[index].image);
        draft.splice(index, 1);
      }
      break;
  }

  return draft;
};

const curriedReducer = produce(reducer);

const Home: NextPage = () => {
  const { alert } = useAlertContext();
  const { modal } = useModalContext();

  const [files, dispatch] = useReducer(curriedReducer, []);

  const changeStatus = (index: number, status: UploadStatus) =>
    dispatch({
      type: "changeStatus",
      index,
      status,
    });

  const changeProgress = (index: number, progress: number) =>
    dispatch({
      type: "changeProgress",
      index,
      progress,
    });

  const setFiles = (files: IFilesMeta[]) =>
    dispatch({
      type: "setFiles",
      files,
    });

  async function upload(file: File) {
    const index = files.findIndex((item) => item.name === file.name);
    changeStatus(index, UploadStatus.UPLOAD);

    try {
      changeStatus(index, UploadStatus.UPLOAD);
      // check if file exists
      const {
        data: { exists },
      } = await instance.get(`/upload/check`, {
        params: {
          filename: file.name,
        },
      });

      if (exists) {
        const action = await modal({
          title: "????????? ??????????????????!",
          message: `${file.name} ?????? ?????? ????????? ?????? ????????? ????????? ??????????????????.\n??? ????????? ?????????????????????????`,
          actions: [
            {
              id: "overwrite",
              content: "????????????",
              color: "primary",
            },
            {
              id: "cancel",
              content: "??????",
              color: "ghost",
            },
          ],
        });

        if (action === "cancel") throw new Error("???????????? ???????????? ???????????????.");
      }

      const {
        data: { endpoint },
      } = await instance.get("/upload/sign", {
        params: {
          filename: file.name,
        },
      });

      // upload image
      await axios.put(endpoint, await fileToFormData(file), {
        onUploadProgress(event) {
          changeProgress(index, event.loaded / event.total);
        },
      });
      // notification
      alert({
        type: "success",
        title: `${file.name} ???????????? ??????????????????.`,
      });
      changeStatus(index, UploadStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        // notification
        alert({
          type: "error",
          title: `${file.name} ???????????? ??????????????????.`,
          message: e.message,
        });
        changeProgress(index, 100);
        changeStatus(index, UploadStatus.ERROR);
      }
    }
  }

  async function handleSubmit(event: FormEvent<FormElement>) {
    event.preventDefault();
    await Promise.all(files.map(({ file }) => upload(file)));
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files as File[] | null;
    if (!files) return setFiles([]);
    setFiles(
      await Promise.all(
        Array.from(files).map(async (file) => ({
          file,
          image: URL.createObjectURL(file),
          name: file.name,
          size: formatBytes(file.size),
          progress: 0,
          status: UploadStatus.PENDING,
        })),
      ),
    );
  }

  const handleFileDelete = (name: string) =>
    dispatch({
      type: "deleteFile",
      name,
    });

  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-3xl font-black"}>????????? ????????? ??????</h1>
      <p className={"text-xl mb-8"}>???????????? ???????????? ????????? ???????????????</p>

      <form onSubmit={handleSubmit} className="card p-4 shadow-2xl flex flex-col gap-4 max-w-2xl">
        <label>
          <span className="btn btn-primary">????????? ?????? ??????</span>
          <input type="file" onChange={handleChange} className={"hidden"} accept={"image/png,image/jpeg"} multiple />
        </label>

        <div className={"flex flex-col gap-1"}>
          <h2 className={"text-xl font-black"}>????????? ??? ?????????</h2>

          {!files.length && <p>?????? ????????? ??? ????????? ????????????.</p>}
          {files.map(({ file, name, image, size, progress, status }) => (
            <div key={name + size} className={"flex items-center justify-between gap-4"}>
              <div className="flex gap-4 items-center">
                <div className="avatar">
                  <div className="w-16 rounded">
                    <Image layout={"fill"} src={image} alt={""} />
                  </div>
                </div>
                <div>
                  <div className={"text-xl font-bold"}>{name}</div>
                  <div className={"text-sm font-light"}>{size}</div>
                </div>
              </div>
              <div className={"flex gap-4"}>
                {status === UploadStatus.UPLOAD && (
                  <progress className={`progress w-48 progress-primary`} value={progress} max="100" />
                )}
                {status === UploadStatus.ERROR && (
                  <button onClick={() => upload(file)} className={"btn btn-secondary"}>
                    ?????? ????????? ??????
                  </button>
                )}
                {status !== UploadStatus.UPLOAD && (
                  <button onClick={() => handleFileDelete(name)} className={"btn btn-error"}>
                    ????????????
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className={"btn btn-primary"}>???????????????</button>
      </form>
    </div>
  );
};

export default Home;
