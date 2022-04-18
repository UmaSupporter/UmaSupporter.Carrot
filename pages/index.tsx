import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-3xl font-black"}>UmaSupporter.Carrot</h1>
      <p className={"text-xl"}>🏃🏽‍♀️ 우마무스메 육성 도우미인 &apos;우마서포터&apos;의 오퍼레이팅 툴입니다.</p>

      <div className={"py-4 inline-flex flex-col gap-4"}>
        <Link href={"/upload"}>
          <a className={"btn btn-primary"}>이미지 업로드하기</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
