import instance from "utils/requester";
import type { NextPage } from "next";
import { useAlertContext } from "hooks/useAlertContext";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { FormElement } from "types/formElement";
import { formatBytes } from "utils/formatBytes";
import { toBase64 } from "utils/toBase64";
import getConfig from "next/config";
import { fileToFormData } from "utils/fileToFormData";

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

const Home: NextPage = () => {
  const { API_PASSWORD } = getConfig().publicRuntimeConfig.CONFIG;
  const { push } = useAlertContext();

  const [files, setFiles] = useState<IFilesMeta[]>([]);

  function stateChange(index: number, status: UploadStatus) {
    setFiles((prev) =>
      prev.map((file, i) =>
        index === i
          ? {
              ...file,
              status,
            }
          : file,
      ),
    );
  }

  function setProgress(index: number, progress: number) {
    setFiles((prev) =>
      prev.map((file, i) =>
        index === i
          ? {
              ...file,
              progress,
            }
          : file,
      ),
    );
  }

  async function upload(file: File) {
    const index = files.findIndex((item) => item.name === file.name);
    stateChange(index, UploadStatus.UPLOAD);

    try {
      stateChange(index, UploadStatus.UPLOAD);
      // upload image
      await instance.post("//suppoter.sonagi.dev/upload", await fileToFormData(file), {
        headers: {
          Authorization: API_PASSWORD,
        },
        onUploadProgress(event) {
          setProgress(index, event.loaded / event.total);
        },
      });
      // notification
      push({
        type: "success",
        message: `${file.name} 업로드가 성공했습니다.`,
      });
      stateChange(index, UploadStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        // notification
        push({
          type: "error",
          title: `${file.name} 업로드가 실패했습니다.`,
          message: e.message,
        });
        setProgress(index, 100);
        stateChange(index, UploadStatus.ERROR);
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
          image: (await toBase64(file)) as string,
          name: file.name,
          size: formatBytes(file.size),
          progress: 0,
          status: UploadStatus.PENDING,
        })),
      ),
    );
  }

  const handleFileDelete = (name: string) => setFiles((prev) => prev.filter(({ name: fName }) => fName !== name));

  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-3xl font-black"}>이미지 업로드 하기</h1>
      <p className={"text-xl mb-8"}>이미지를 추가하고 버튼을 눌러보아요</p>

      <form onSubmit={handleSubmit} className="card p-4 shadow-2xl flex flex-col gap-4 max-w-2xl">
        <label>
          <span className="btn btn-primary">이미지 선택 하기</span>
          <input type="file" onChange={handleChange} className={"hidden"} accept={"image/png,image/jpeg"} multiple />
        </label>

        <div className={"flex flex-col gap-1"}>
          <h2 className={"text-xl font-black"}>업로드 될 컨텐츠</h2>

          {!files.length && <p>아직 업로드 될 내용이 없습니다.</p>}
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
                    다시 업로드 하기
                  </button>
                )}
                {status !== UploadStatus.UPLOAD && (
                  <button onClick={() => handleFileDelete(name)} className={"btn btn-error"}>
                    삭제하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className={"btn btn-primary"}>업로드하기</button>
      </form>
    </div>
  );
};

export default Home;
